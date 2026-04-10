"use client";

import Input from "@/default_components/form/input/InputField";
import Label from "@/default_components/form/Label";
import Select from "@/default_components/form/Select";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import NoControlModalBox from "../modal/NoControlModalBox";
import { useModal } from "@/hooks/useModal";
import { Pencil } from "lucide-react";
import {
  Category,
  ProductResponse,
  ProductUpdateRequest,
} from "@/interfaces/warehouseManagementType";
import { ProductUpdateAction } from "@/actions/system-info";

interface ProductFormProps {
  setLoading: (loading: boolean) => void;
  setDisable: (loading: boolean) => void;
  onSuccess: () => void;
  initialData: ProductResponse;
  categoryData: Category[];
}

const UpdateProductForm = ({
  setLoading,
  setDisable,
  onSuccess,
  initialData,
  categoryData,
}: ProductFormProps) => {
  // Initiate form control
  const router = useRouter();
  const categoryOption = categoryData
    .map((cat) =>
      cat.subcategories.map((subCat) => ({
        value: subCat.id.toString(),
        label: `${cat.name} - ${subCat.name} (${subCat.code})`,
      })),
    )
    .flat();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProductUpdateRequest>({
    defaultValues: {
      name: initialData.name,
      description: initialData.description,
      categoryId: initialData.categoryId ? String(initialData.categoryId) : "",
    },
  });

  useEffect(() => {
    setDisable(!isDirty);
  }, [isDirty, setDisable]);

  //Validation Logic
  const onSubmit: SubmitHandler<ProductUpdateRequest> = async (data) => {
    setLoading(true);
    try {
      const payload: ProductUpdateRequest = {
        name: data.name,
        description: data.description !== "" ? data.description : null,
        categoryId: Number(data.categoryId),
      };
      await ProductUpdateAction(Number(initialData?.id), payload);
      toast.success("Product info update successfully!");
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
      id="updateProductForm"
      onSubmit={handleSubmit(onSubmit)}
      className={"mt-4 space-y-6"}
    >
      {/* Name */}
      <div>
        <Label>Product Name</Label>
        <Input
          placeholder={"e.g. Coca"}
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
          {...register("categoryId", { required: "Please select a category" })}
          placeholder={"Select category"}
          options={categoryOption}
          error={!!errors.categoryId}
          hint={errors.categoryId?.message}
        />
      </div>
    </form>
  );
};

export function ModalProductUpdateForm({
  initialData,
  categoryData,
}: {
  initialData: ProductResponse;
  categoryData: Category[];
}) {
  const [loading, setLoading] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const [disable, setDisable] = useState(false);

  return (
    <NoControlModalBox
      btnClassName="h-8 w-8"
      startIcon={<Pencil size={16} />}
      openBtnTitle={""}
      formId={"updateProductForm"}
      isLoading={loading}
      isOpen={isOpen}
      onOpen={openModal}
      onClose={closeModal}
      disableSaveBtn={disable}
      modalContent={
        <UpdateProductForm
          setLoading={setLoading}
          setDisable={setDisable}
          onSuccess={closeModal}
          initialData={initialData}
          categoryData={categoryData}
        />
      }
    />
  );
}
