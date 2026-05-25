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
import Select from "@/default_components/form/Select";
import AccordionTable from "@/components/table/AccordionTable";
import {
  getCategoryHeaders,
  getSubCategoryHeaders,
} from "@/components/table/AccordionTableHeader";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  categoryCreateAction,
  categoryDeleteAction,
  categoryUpdateAction,
} from "@/actions/system-info";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { useAuth } from "@/context/AuthContext";

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
        parentCategoryId: data.parentCategoryId
          ? Number(data.parentCategoryId)
          : null,
      };
      if (isEditMode) {
        await categoryUpdateAction(initialData.id, payload);
        toast.success("Category updated successfully!");
      } else {
        await categoryCreateAction(payload);
        toast.success("Category created successfully!");
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
  const { user } = useAuth();
  const hasCreatePerm = user?.permissions.includes("CREATE_CATEGORY") ?? false;
  const hasUpdatePerm = user?.permissions.includes("UPDATE_CATEGORY") ?? false;
  const hasDeletePerm = user?.permissions.includes("DELETE_CATEGORY") ?? false;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [disableDelete, setDisableDelete] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const { confirm, ConfirmationModal } = useConfirmModal();
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
  const handleDelete = useCallback(
    async (id: number) => {
      const isConfirmed = await confirm({
        title: "Delete Category",
        message: "Are you sure you want to delete this category?",
      });
      if (!isConfirmed) return;
      try {
        setDisableDelete(true);
        await categoryDeleteAction(id);
        toast.success("Category deleted successfully!");
        router.refresh();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message ?? "An unexpected error occurred");
      } finally {
        setDisableDelete(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router],
  );
  const headers = useMemo(
    () =>
      getCategoryHeaders(
        handleEdit,
        handleDelete,
        disableDelete,
        hasUpdatePerm,
        hasDeletePerm,
      ),
    [handleEdit, handleDelete, disableDelete, hasUpdatePerm, hasDeletePerm],
  );
  const subheaders = useMemo(
    () =>
      getSubCategoryHeaders(
        handleEdit,
        handleDelete,
        disableDelete,
        hasUpdatePerm,
        hasDeletePerm,
      ),
    [handleEdit, handleDelete, disableDelete, hasUpdatePerm, hasDeletePerm],
  );

  return (
    <div>
      {ConfirmationModal}
      <div className={"flex justify-end px-6 pt-6"}>
        <NoControlModalBox
          startIcon={<Plus size={16} />}
          openBtnTitle={"New Category"}
          formId={"tableForm"}
          isLoading={loading}
          isOpen={isOpen}
          disableSaveBtn={disable}
          showOpenBtn={hasCreatePerm}
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
          getRowId={(params) => String(params.data.id)}
          subTableGetRowId={(params) => String(params.data.id)}
        />
      </div>
    </div>
  );
}
