"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { useModal } from "@/hooks/useModal";
import NoControlModalBox from "@/components/modal/NoControlModalBox";
import CustomizableTable from "./table/CustomizableTable";
import Label from "@/default_components/form/Label";
import Input from "@/default_components/form/input/InputField";
import Select from "@/default_components/form/Select";
import {
  VariantResponse,
  AttributeResponse,
} from "@/interfaces/warehouseManagementType";
import {
  ProductCreateVariantAction,
  ProductDeleteAction,
  VariantDeleteAction,
  VariantUpdateAction,
} from "@/actions/system-info";
import { getVariantHeaders } from "./table/CustomizableTableHeader";
import Button from "@/default_components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";

// ----------------------------------------------------------------------
// 1. THE UNIFIED FORM COMPONENT
// ----------------------------------------------------------------------
interface VariantFormProps {
  productId: number;
  setLoading: (loading: boolean) => void;
  setDisable: (loading: boolean) => void;
  onSuccess: () => void;
  initialData?: VariantResponse;
  availableAttributes: AttributeResponse[];
}

interface CombinedVariantFormData {
  description: string;
  attributes: { attributeId: string | number; value: string }[];
}

const VariantForm = ({
  productId,
  setLoading,
  setDisable,
  onSuccess,
  initialData,
  availableAttributes,
}: VariantFormProps) => {
  const router = useRouter();
  const isEditMode = !!initialData;

  const attributeOptions = availableAttributes.map((attr) => ({
    value: attr.id.toString(),
    label: attr.name,
  }));

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors, isDirty },
  } = useForm<CombinedVariantFormData>({
    defaultValues: {
      description: initialData?.description || "",
      attributes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });

  useEffect(() => {
    setDisable(!isDirty);
  }, [isDirty, setDisable]);

  const onSubmit: SubmitHandler<CombinedVariantFormData> = async (data) => {
    setLoading(true);
    try {
      if (isEditMode) {
        // --- EDIT MODE PAYLOAD ---
        const updatePayload = {
          description: data.description !== "" ? data.description : null,
          image: null,
        };
        await VariantUpdateAction(initialData.id, updatePayload);
        toast.success("Variant updated successfully!");
      } else {
        // --- CREATE MODE PAYLOAD ---
        const createPayload = {
          productId: Number(productId),
          description: data.description !== "" ? data.description : null,
          image: null,
          attributes: data.attributes.map((attr) => ({
            attributeId: Number(attr.attributeId),
            value: attr.value,
          })),
        };
        if (createPayload.attributes.length === 0) {
          throw new Error(
            "Please add at least one attribute (e.g. Color, Size).",
          );
        }
        await ProductCreateVariantAction(createPayload);
        toast.success("Variant created successfully!");
      }
      router.refresh();
      onSuccess();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message ?? "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      id="variantForm"
      onSubmit={handleSubmit(onSubmit)}
      className="mt-7 max-h-[60vh] space-y-6 overflow-auto px-3"
    >
      {/* --- GENERAL INFO (Shown in both modes) --- */}
      <div className="w-full">
        <Label>Description</Label>
        <Input
          placeholder="e.g. Summer Collection 2025"
          {...register("description")}
          error={!!errors.description}
          hint={errors.description?.message}
        />
      </div>

      {/* --- ATTRIBUTES (Only shown in Create mode) --- */}
      {!isEditMode && (
        <div className="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
          <Label className="text-base font-semibold">Variant Attributes</Label>
          <p className="text-sm text-gray-500">
            Define specific characteristics (e.g., Color: Red, Size: XL).
          </p>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 md:flex-row md:items-start dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="w-full">
                <Label>Attribute</Label>
                <Select
                  options={attributeOptions}
                  placeholder="Select Attribute"
                  {...register(`attributes.${index}.attributeId`, {
                    required: "Required",
                    validate: (val) => {
                      if (!val) return true;
                      // Get all current attributes in the form
                      const allAttributes = getValues("attributes");
                      // Look for any OTHER row that has the exact same attributeId selected
                      const duplicates = allAttributes.filter(
                        (a, idx) =>
                          idx !== index &&
                          Number(a.attributeId) === Number(val),
                      );
                      // If a duplicate exists, return the error message!
                      if (duplicates.length > 0) {
                        return "This attribute is already selected.";
                      }
                      return true;
                    },
                  })}
                  error={!!errors.attributes?.[index]?.attributeId}
                  hint={errors.attributes?.[index]?.attributeId?.message}
                />
              </div>

              <div className="flex w-full flex-col">
                <Label>Value</Label>
                <div className="flex w-full items-start gap-3">
                  <div className="w-full">
                    <Input
                      placeholder="e.g. Red, XL"
                      {...register(`attributes.${index}.value`, {
                        required: "Required",
                      })}
                      error={!!errors.attributes?.[index]?.value}
                      hint={errors.attributes?.[index]?.value?.message}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="rounded-lg border border-red-200 p-2.5 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ attributeId: "", value: "" })}
            className="hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 transition-all dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <Plus size={16} />
            Add Attribute
          </button>
        </div>
      )}
    </form>
  );
};

// ----------------------------------------------------------------------
// 2. THE VARIANT MANAGER
// ----------------------------------------------------------------------
export function VariantManager({
  productId,
  data,
  availableAttributes,
}: {
  productId: number;
  data: VariantResponse[];
  availableAttributes: AttributeResponse[];
}) {
  const { user } = useAuth();
  const hasEditProductPerm =
    user?.permissions.includes("EDIT_PRODUCT") ?? false;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [disableDelete, setDisableDelete] = useState(false);

  const { isOpen, openModal, closeModal } = useModal();
  const { confirm, ConfirmationModal } = useConfirmModal();

  const [selectedVariant, setSelectedVariant] = useState<
    VariantResponse | undefined
  >(undefined);

  // --- HANDLERS ---
  const handleEdit = useCallback(
    (variant: VariantResponse) => {
      setSelectedVariant(variant);
      openModal();
    },
    [openModal],
  );

  const handleDelete = useCallback(
    async (id: number) => {
      const isConfirmed = await confirm({
        title: "Delete Variant",
        message:
          "Are you sure you want to delete this variant? This action cannot be undone.",
      });
      if (!isConfirmed) return;

      try {
        setDisableDelete(true);
        await VariantDeleteAction(id);
        toast.success("Variant deleted successfully!");
        router.refresh();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message ?? "An unexpected error occurred");
      } finally {
        setDisableDelete(false);
      }
    },
    [confirm, router],
  );

  const handleDeleteProduct = useCallback(
    async (id: number) => {
      console.log(id);
      const isConfirmed = await confirm({
        title: "Delete Product",
        message: "Are you sure you want to delete this product?",
      });
      if (!isConfirmed) return;
      try {
        setDisable(true);
        await ProductDeleteAction(id);
        toast.success("Product deleted successfully!");
        router.back();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message ?? "An unexpected error occurred");
        setDisable(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router],
  );

  // Memorize headers so the table doesn't over-render
  const headers = useMemo(
    () =>
      getVariantHeaders(
        handleEdit,
        handleDelete,
        disableDelete,
        hasEditProductPerm,
      ),
    [handleEdit, handleDelete, disableDelete, hasEditProductPerm],
  );

  return (
    <div className="default-card flex flex-col gap-6">
      {ConfirmationModal}

      {/* Header and Modal Trigger */}
      <div className="flex items-center justify-between border-b border-gray-200 p-6 pb-4 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Product Variants
        </h3>

        {hasEditProductPerm && (
          <div className="flex gap-3">
            <NoControlModalBox
              startIcon={<Plus size={16} />}
              openBtnTitle="New Variant"
              formId="variantForm"
              isLoading={loading}
              isOpen={isOpen}
              disableSaveBtn={disable}
              onOpen={() => {
                setSelectedVariant(undefined);
                openModal();
              }}
              onClose={closeModal}
              modalContent={
                <VariantForm
                  productId={productId}
                  setDisable={setDisable}
                  setLoading={setLoading}
                  onSuccess={closeModal}
                  initialData={selectedVariant}
                  availableAttributes={availableAttributes}
                />
              }
            />
            <Button
              size="sm"
              variant="danger"
              disabled={disable}
              onClick={() => handleDeleteProduct(productId)}
            >
              <Trash2 size={16} />
              Delete Product
            </Button>
          </div>
        )}
      </div>

      {/* Table Content */}
      <div className="px-6 pb-6">
        <CustomizableTable headers={headers} data={data} />
      </div>
    </div>
  );
}
