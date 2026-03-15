"use client";

import { ProductCreateAction } from "@/actions/system-info";
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
    reset,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<ProductCreateRequest>({
    defaultValues: {
      name: "",
      description: null,
      categoryId: null,
      baseUnitId: null,
      batchUnitId: null,
      itemUnitId: null,
    },
  });

  // Dynamic Fields for Extra Conversions
  const { fields, append, remove } = useFieldArray({
    control,
    name: "additionalConversions",
  });

  const baseUnitId = useWatch({ control, name: "baseUnitId" });
  const batchUnitId = useWatch({ control, name: "batchUnitId" });
  const itemUnitId = useWatch({ control, name: "itemUnitId" });

  const isBatchSameAsBase =
    baseUnitId !== null && batchUnitId !== null && baseUnitId === batchUnitId;
  const isItemSameAsBase =
    baseUnitId !== null && itemUnitId !== null && baseUnitId === itemUnitId;

  //Validation Logic
  const onSubmit: SubmitHandler<ProductCreateRequest> = async (data) => {
    setLoading(true);
    try {
      const payload: ProductCreateRequest = {
        name: data.name,
        description: data.description !== "" ? data.description : null,
        categoryId: Number(data.categoryId),
        baseUnitId: Number(data.baseUnitId),
        batchUnitId: Number(data.batchUnitId),
        batchConversionRate: Number(data.batchConversionRate),
        itemUnitId: Number(data.itemUnitId),
        itemConversionRate: Number(data.itemConversionRate),
      };
      if (data.additionalConversions && data.additionalConversions.length > 0) {
        payload.additionalConversions = data.additionalConversions.map(
          (conv) => ({
            fromUnitId: Number(conv.fromUnitId),
            toUnitId: Number(data.baseUnitId), // ALWAYS TARGET BASE UNIT
            conversionRate: Number(conv.conversionRate),
          }),
        );
      }
      await ProductCreateAction(payload);
      reset();
      toast.success("Product created successfully!");
      router.replace("/catalog/product");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message ?? "An unexpected error occurred");
    } finally {
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
        {/* Item Unit */}
        <div>
          <Label>Item Unit</Label>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="w-full">
              <Select
                {...register("itemUnitId", {
                  required: "Please select unit for item",
                  onChange: (e) => {
                    if (e.target.value === itemUnitId) {
                      setValue("itemConversionRate", 1);
                      clearErrors("itemConversionRate");
                    } else {
                      setValue("itemConversionRate", undefined);
                    }
                  },
                })}
                placeholder={"Select item unit"}
                options={unitOption}
                error={!!errors.itemUnitId}
                hint={errors.itemUnitId?.message}
              />
            </div>
            <div className="flex w-full">
              <div className="flex h-11 min-w-fit items-center justify-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <span className="whitespace-nowrap">Conversion Rate</span>
              </div>
              <div className="w-full">
                <Input
                  type="text"
                  className="rounded-l-none"
                  {...register("itemConversionRate", {
                    validate: (value, formValues) => {
                      // If units match, we don't care (or it is 1)
                      if (formValues.baseUnitId === formValues.itemUnitId)
                        return true;
                      // If units differ, validation is strict
                      if (!value) return "Conversion rate is required";
                      if (Number(value) <= 0) return "Must be > 0";
                      return true;
                    },
                  })}
                  error={!!errors.itemConversionRate}
                  hint={errors.itemConversionRate?.message}
                  placeholder={
                    isItemSameAsBase ? "1" : "1 item equal to ... base unit"
                  }
                  disabled={!itemUnitId || isItemSameAsBase}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Batch Unit */}
        <div>
          <Label>Batch Unit</Label>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="w-full">
              <Select
                {...register("batchUnitId", {
                  required: "Please select unit for batch",
                  onChange: (e) => {
                    if (e.target.value === baseUnitId) {
                      setValue("batchConversionRate", 1);
                      clearErrors("batchConversionRate");
                    } else {
                      setValue("batchConversionRate", undefined);
                    }
                  },
                })}
                placeholder={"Select batch unit"}
                options={unitOption}
                error={!!errors.batchUnitId}
                hint={errors.batchUnitId?.message}
              />
            </div>
            <div className="flex w-full">
              <div className="flex h-11 min-w-fit items-center justify-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <span className="whitespace-nowrap">Conversion Rate</span>
              </div>
              <div className="w-full">
                <Input
                  type="text"
                  className="rounded-l-none"
                  {...register("batchConversionRate", {
                    validate: (value, formValues) => {
                      // If units match, we don't care (or it is 1)
                      if (formValues.baseUnitId === formValues.batchUnitId)
                        return true;
                      // If units differ, validation is strict
                      if (!value) return "Conversion rate is required";
                      if (Number(value) <= 0) return "Must be > 0";
                      return true;
                    },
                  })}
                  error={!!errors.batchConversionRate}
                  hint={errors.batchConversionRate?.message}
                  placeholder={
                    isBatchSameAsBase ? "1" : "1 batch equal to ... base unit"
                  }
                  disabled={!batchUnitId || isBatchSameAsBase}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Additional Conversion */}
        <div className="space-y-4">
          {fields.map((field, index) => {
            // Note: using useWatch inside map is okay in newer RHF but safer to rely on render cycle or just show generic
            // For simplicity in this structure, we stick to standard layout
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
                            return true;
                          },
                        },
                      )}
                      placeholder="Select Unit"
                      options={unitOption}
                      error={
                        !!errors.additionalConversions?.[index]?.fromUnitId
                      }
                      hint={errors.additionalConversions?.[index]?.message}
                    />
                  </div>
                  <div className="flex w-full">
                    <div className="flex h-11 min-w-fit items-center justify-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                      <span className="whitespace-nowrap">Conversion Rate</span>
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
                          errors.additionalConversions?.[index]?.conversionRate
                            ?.message
                        }
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
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
          onClick={() => router.replace("/catalog/product")}
          type="button"
        >
          Cancel
        </Button>
        <Button size="sm" disabled={loading} type="submit">
          Save
        </Button>
      </div>
    </form>
  );
};
