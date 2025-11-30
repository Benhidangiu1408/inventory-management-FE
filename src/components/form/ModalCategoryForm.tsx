"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import Label from "@/default_components/form/Label";
import Input from "@/default_components/form/input/InputField";
import NoControlModalBox from "@/components/modal/NoControlModalBox";
import { useModal } from "@/hooks/useModal";
import {
  Category,
  CategoryRequest,
  SubCategory,
} from "@/interfaces/warehouseManagementType";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api-mask";
import Select from "@/default_components/form/Select";
import AccordionTable from "@/components/table/AccordionTable";
import {
  getCategoryHeaders,
  getSubCategoryHeaders,
} from "@/components/table/AccordionTableHeader";
import { categoryService } from "@/services/WarehouseManagementService";
import { useForm, SubmitHandler } from "react-hook-form";
import Radio from "@/default_components/form/input/Radio";

interface CategoryFormProps {
  setLoading: (loading: boolean) => void;
  setDisable: (loading: boolean) => void;
  onSuccess: () => void;
  initialData?: SubCategory;
  existingCategories?: Category[];
}

const CategoryForm = ({
  setLoading,
  setDisable,
  onSuccess,
  initialData,
  existingCategories = [],
}: CategoryFormProps) => {
  const router = useRouter();
  const isEditMode = !!initialData;
  const isRoot = isEditMode && initialData?.parentCategoryId === null;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CategoryRequest>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || null,
      status: initialData?.status || "ACTIVE",
      parentCategoryId: initialData?.parentCategoryId || null,
    },
  });

  useEffect(() => {
    setDisable(!isDirty);
  }, [isDirty, setDisable]);

  const parentOptions = useMemo(() => {
    return existingCategories
      .filter((c) => c.id !== initialData?.id)
      .map((c) => ({ value: c.id.toString(), label: c.name }));
  }, [existingCategories, initialData]);

  const onSubmit: SubmitHandler<CategoryRequest> = async (data) => {
    setLoading(true);
    try {
      const payload: CategoryRequest = {
        name: data.name,
        description: data.description !== "" ? data.description : null,
        status: data.status,
        parentCategoryId: data.parentCategoryId
          ? Number(data.parentCategoryId)
          : null,
      };
      if (isEditMode) {
        await categoryService.update(initialData.id, payload);
        toast.success("Category updated successfully!");
      } else {
        await categoryService.create(payload);
        toast.success("Category created successfully!");
      }
      router.refresh();
      onSuccess();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      id={"tableForm"}
      onSubmit={handleSubmit(onSubmit)}
      className={"mt-4 space-y-6"}
    >
      {/* Name Input */}
      <div>
        <Label>Category Name</Label>
        <Input
          type="text"
          placeholder={"e.g. Electronics"}
          {...register("name", {
            required: "Category name is required",
          })}
          error={!!errors.name}
          hint={errors.name?.message}
        />
      </div>
      {/* Description Input */}
      <div>
        <Label>Category Description</Label>
        <Input
          type="text"
          placeholder={"Describe your category"}
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
      {/* Status Radio */}
      <div className="flex items-center gap-3">
        <Radio
          id="status-active"
          label="Active"
          value={"ACTIVE"}
          {...register("status")}
        />
        <Radio
          id="status-inactive"
          label="Inactive"
          value={"INACTIVE"}
          {...register("status")}
        />
      </div>
      {/* Select */}
      <div>
        <Label className={`${isRoot ? "opacity-50" : ""}`}>
          Parent Category
        </Label>
        <Select
          disabled={isRoot}
          placeholder={"Select parent category"}
          {...register("parentCategoryId")}
          options={parentOptions}
          error={!!errors.parentCategoryId}
          hint="If you leave this empty, the new category will be a root category"
        />
      </div>
    </form>
  );
};

export function ModalCategoryForm({ data }: { data: Category[] }) {
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedCategory, setSelectedCategory] = useState<
    SubCategory | undefined
  >(undefined);
  const handleEdit = useCallback(
    (item: Category | SubCategory) => {
      // Cast to Category type so we can add properties safely
      const fullItem = { ...item } as SubCategory;
      // If it's a category (missing parentId), set to null
      if (!fullItem.parentCategoryId) {
        fullItem.parentCategoryId = null;
      }
      setSelectedCategory(fullItem);
      openModal();
    },
    [openModal],
  );
  const headers = useMemo(() => getCategoryHeaders(handleEdit), [handleEdit]);
  const subheaders = useMemo(
    () => getSubCategoryHeaders(handleEdit),
    [handleEdit],
  );

  return (
    <div>
      <div className={"pt-6 pl-6"}>
        <NoControlModalBox
          startIcon={<Plus size={16} />}
          openBtnTitle={"New Category"}
          formId={"tableForm"}
          isLoading={loading}
          isOpen={isOpen}
          disableSaveBtn={disable}
          onOpen={() => {
            setSelectedCategory(undefined);
            openModal();
          }}
          onClose={closeModal}
          modalContent={
            <CategoryForm
              setDisable={setDisable}
              setLoading={setLoading}
              onSuccess={closeModal}
              existingCategories={data}
              initialData={selectedCategory}
            />
          }
        />
      </div>
      <div className="p-6">
        <AccordionTable
          headers={headers}
          subTableHeaders={subheaders}
          subTableKey={"subcategories"}
          data={data}
        />
      </div>
    </div>
  );
}
