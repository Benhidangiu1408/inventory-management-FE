"use client";

import { ProductCreateAction, uploadImageAction } from "@/actions/system-info";
import ComponentCard from "@/default_components/common/ComponentCard";
import Input from "@/default_components/form/input/InputField";
import Label from "@/default_components/form/Label";
import Select from "@/default_components/form/Select";
import Button from "@/default_components/ui/button/Button";
import {
  Category,
  ProductCreateRequest,
  UnitResponse,
} from "@/interfaces/warehouseManagementType";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import toast from "react-hot-toast";
import ImagePicker from "../ImagePicker";

interface CombinedProductFormData extends ProductCreateRequest {
  rawFile?: File | null;
}

export const CreateProductForm = ({
  category,
  unit,
}: {
  category: Category[];
  unit: UnitResponse[];
}) => {
  // Initiate form control
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const categoryOption = category
    .map((cat) =>
      cat.subcategories.map((subCat) => ({
        value: subCat.id.toString(),
        label: `${cat.name} - ${subCat.name} (${subCat.code})`,
      })),
    )
    .flat();
  const unitOption = unit.map((val) => ({
    value: val.id.toString(),
    label: `${val.abb} (${val.name})`,
  }));
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<CombinedProductFormData>({
    defaultValues: {
      name: "",
      description: null,
      categoryId: null,
      baseUnitId: null,
      image: null,
      rawFile: null,
    },
  });

  // Dynamic Fields for Extra Conversions
  const { fields, append, remove } = useFieldArray({
    control,
    name: "additionalConversions",
  });
  const baseUnitId = useWatch({ control, name: "baseUnitId" });

  //Validation Logic
  const onSubmit: SubmitHandler<CombinedProductFormData> = async (data) => {
    setLoading(true);
    const toastId = toast.loading("Creating product...");
    try {
      let finalImageUrl = data.image || null;
      if (data.rawFile) {
        toast.loading("Uploading image to storage...", { id: toastId });
        const { uploadUrl, finalImageUrl: s3Url } = await uploadImageAction(
          data.rawFile.name,
          data.rawFile.type,
        );
        const s3Response = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": data.rawFile.type,
          },
          body: data.rawFile,
        });
        if (!s3Response.ok) throw new Error("Failed to upload image to S3");

        finalImageUrl = s3Url;
        toast.loading("Saving to database...", { id: toastId });
      }
      const payload: ProductCreateRequest = {
        name: data.name,
        description: data.description !== "" ? data.description : null,
        categoryId: Number(data.categoryId),
        baseUnitId: Number(data.baseUnitId),
        image: finalImageUrl,
      };
      if (data.additionalConversions && data.additionalConversions.length > 0) {
        payload.additionalConversions = data.additionalConversions.map(
          (conv) => ({
            fromUnitId: Number(conv.fromUnitId),
            conversionRate: Number(conv.conversionRate),
          }),
        );
      }
      await ProductCreateAction(payload);
      toast.success("Product created successfully!");
      router.replace("/catalog/product");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message ?? "An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={"mt-4 space-y-6"}>
      <ComponentCard title="General Info">
        {/* Name */}
        <div>
          <Label>Product Name</Label>
          <Input
            placeholder={"e.g. Coca Cola"}
            {...register("name", {
              required: "Product name is required",
            })}
            error={!!errors.name}
            hint={errors.name?.message}
          />
        </div>
        {/* Description */}
        <div>
          <Label>Description</Label>
          <Input
            type="text"
            placeholder={"Describe your product"}
            {...register("description", {
              maxLength: {
                value: 100,
                message: "Description is too long (max 100 chars)",
              },
            })}
            error={!!errors.description}
            hint={errors.description?.message}
          />
        </div>
        {/* Select */}
        <div>
          <Label>Category</Label>
          <Select
            {...register("categoryId", {
              required: "Please select a category",
            })}
            placeholder={"Select category"}
            options={categoryOption}
            error={!!errors.categoryId}
            hint={errors.categoryId?.message}
          />
        </div>
        {/* --- ADDED IMAGE PICKER HERE --- */}
        <div className="mb-4 w-full">
          <Label>Product Image (Default Variant)</Label>
          <ImagePicker
            onFileSelected={(file) => {
              setValue("rawFile", file, { shouldDirty: true });
            }}
          />
        </div>
      </ComponentCard>
      <ComponentCard title="Unit Config">
        {/* Base unit */}
        <div>
          <Label>Base Unit</Label>
          <Select
            {...register("baseUnitId", {
              required: "Please select a base unit",
            })}
            placeholder={"Select base unit"}
            options={unitOption}
            error={!!errors.baseUnitId}
            hint={errors.baseUnitId?.message}
          />
        </div>
        {/* Additional Conversion */}
        <div className="space-y-4">
          {fields.map((field, index) => {
            return (
              <div key={field.id}>
                <Label>From Unit</Label>
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                  <div className="w-full">
                    <Select
                      {...register(
                        `additionalConversions.${index}.fromUnitId`,
                        {
                          required: "Required",
                          validate: (val) => {
                            if (Number(val) === Number(baseUnitId))
                              return "Cannot be Base Unit";
                            const allConversions =
                              getValues("additionalConversions") || [];
                            const duplicateCount = allConversions.filter(
                              (conv) => Number(conv.fromUnitId) === Number(val),
                            ).length;
                            if (duplicateCount > 1)
                              return "Unit already selected";
                            return true;
                          },
                        },
                      )}
                      placeholder="Select Unit"
                      options={unitOption}
                      error={
                        !!errors.additionalConversions?.[index]?.fromUnitId
                      }
                      hint={
                        errors.additionalConversions?.[index]?.fromUnitId
                          ?.message
                      }
                    />
                  </div>
                  <div className="flex w-full items-center gap-3">
                    <div className="flex w-full">
                      <div className="flex h-11 min-w-fit items-center justify-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                        <span className="whitespace-nowrap">
                          Conversion Rate
                        </span>
                      </div>
                      <div className="w-full">
                        <Input
                          type="number"
                          className="rounded-l-none"
                          placeholder="Quantity"
                          {...register(
                            `additionalConversions.${index}.conversionRate`,
                            {
                              required: "Conversion rate is required",
                              min: { value: 1, message: "Must be > 0" },
                            },
                          )}
                          error={
                            !!errors.additionalConversions?.[index]
                              ?.conversionRate
                          }
                          hint={
                            errors.additionalConversions?.[index]
                              ?.conversionRate?.message
                          }
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="border-error-200 text-error-500 hover:bg-error-50 hover:text-error-600 dark:border-error-900/50 dark:hover:bg-error-900/20 flex h-11 w-11 items-center justify-center rounded-lg border transition-colors"
                      title="Remove Rule"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <Button
            type="button"
            variant="outline"
            startIcon={<Plus size={16} />}
            onClick={() => append({ fromUnitId: null, conversionRate: null })}
            disabled={!baseUnitId}
            className="w-full border-dashed border-gray-300 hover:border-gray-400 dark:border-gray-700"
          >
            Add Conversion Rule
          </Button>
          {!baseUnitId && (
            <p className="text-center text-xs text-gray-400">
              Select a Base Unit first to add conversions.
            </p>
          )}
        </div>
      </ComponentCard>
      <div className="flex gap-3">
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.back()}
          type="button"
        >
          Cancel
        </Button>
        <Button size="sm" disabled={loading} type="submit">
          Create
        </Button>
      </div>
    </form>
  );
};
