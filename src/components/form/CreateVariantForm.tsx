"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import {
  AttributeResponse,
  VariantCreateRequest,
} from "@/interfaces/warehouseManagementType";
import { productService } from "@/services/WarehouseManagementService";
import { ApiError } from "@/lib/api-mask";
import ComponentCard from "@/default_components/common/ComponentCard";
import Input from "@/default_components/form/input/InputField";
import Label from "@/default_components/form/Label";
import Select from "@/default_components/form/Select";
import Button from "@/default_components/ui/button/Button";

export const CreateVariantForm = ({
  availableAttributes,
}: {
  availableAttributes: AttributeResponse[];
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const productId = useParams().id;
  // Transform attributes for the Select component
  const attributeOptions = availableAttributes.map((attr) => ({
    value: attr.id.toString(),
    label: attr.name,
  }));

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VariantCreateRequest>({
    defaultValues: {
      description: "",
      minimumStockRequire: 0,
      // image: null
      attributes: [],
    },
  });

  // Dynamic Attribute Fields
  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });

  const onSubmit: SubmitHandler<VariantCreateRequest> = async (data) => {
    setLoading(true);
    try {
      const payload: VariantCreateRequest = {
        productId: Number(productId),
        description: data.description !== "" ? data.description : null,
        minimumStockRequire: Number(data.minimumStockRequire) || 0,
        image: null,
        attributes: data.attributes.map((attr) => ({
          attributeId: Number(attr.attributeId),
          value: attr.value,
        })),
      };
      if (payload.attributes.length === 0) {
        throw new Error(
          "Please add at least one attribute (e.g. Color, Size).",
        );
      }
      await productService.createVariant(payload);
      toast.success("Variant created successfully!");
      router.replace("/catalog/product");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-6">
      {/* --- GENERAL INFO --- */}
      <ComponentCard title="Variant Details">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Description */}
          <div className="col-span-2">
            <Label>Description</Label>
            <Input
              placeholder="e.g. Summer Collection 2025"
              {...register("description")}
              error={!!errors.description}
              hint={errors.description?.message}
            />
          </div>
          {/* Min Stock */}
          <div>
            <Label>Minimum Stock Requirement</Label>
            <Input
              type="number"
              placeholder="0"
              {...register("minimumStockRequire", {
                valueAsNumber: true,
                min: { value: 0, message: "Cannot be negative" },
              })}
              error={!!errors.minimumStockRequire}
              hint={errors.minimumStockRequire?.message}
            />
          </div>
        </div>
      </ComponentCard>
      {/* --- ATTRIBUTES (Dynamic) --- */}
      <ComponentCard title="Variant Attributes">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Define the specific characteristics of this variant (e.g. Color:
            Red, Size: XL).
          </p>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 md:flex-row md:items-stretch dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Select Attribute Name */}
              <div className="flex-1">
                <Label>Attribute</Label>
                <Select
                  options={attributeOptions}
                  placeholder="Select Attribute"
                  {...register(`attributes.${index}.attributeId` as const, {
                    required: "Required",
                  })}
                  error={!!errors.attributes?.[index]?.attributeId}
                  hint={errors.attributes?.[index]?.attributeId?.message}
                />
              </div>

              {/* Input Attribute Value */}
              <div className="flex-1">
                <Label>Value</Label>
                <Input
                  placeholder="e.g. Red, XL, Cotton"
                  {...register(`attributes.${index}.value` as const, {
                    required: "Required",
                  })}
                  error={!!errors.attributes?.[index]?.value}
                  hint={errors.attributes?.[index]?.value?.message}
                />
              </div>

              {/* Remove Button */}
              <div className="flex flex-col justify-center">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="rounded-md p-2.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  title="Remove Attribute"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {/* Add Button */}
          <button
            type="button"
            onClick={() => append({ attributeId: 0, value: "" })} // 0 is placeholder, will be set by select
            className="hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 transition-all dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <Plus size={16} />
            Add Attribute
          </button>

          {errors.attributes && (
            <p className="text-sm text-red-500">
              {errors.attributes.root?.message}
            </p>
          )}
        </div>
      </ComponentCard>

      {/* --- ACTIONS --- */}
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
          {loading ? "Creating..." : "Create Variant"}
        </Button>
      </div>
    </form>
  );
};
