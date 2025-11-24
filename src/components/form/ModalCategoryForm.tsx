"use client";

import React, { FormEvent, useMemo, useState } from "react";
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
import Checkbox from "@/default_components/form/input/Checkbox";

interface CategoryFormProps {
  setLoading: (loading: boolean) => void;
  onSuccess: () => void;
  initialData?: SubCategory;
  existingCategories?: Category[];
}

function CategoryForm({
  setLoading,
  onSuccess,
  initialData,
  existingCategories = [],
}: CategoryFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;
  const isRoot = isEditMode && initialData?.parentCategoryId === null;
  // Form State
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    status: initialData?.status || "ACTIVE",
    parentCategoryId: initialData?.parentCategoryId?.toString() || "",
  });

  const parentOptions = useMemo(() => {
    return existingCategories
      .filter((c) => c.id !== initialData?.id)
      .map((c) => ({ value: c.id.toString(), label: c.name }));
  }, [existingCategories, initialData]);

  //Validation Logic
  const [errors, setErrors] = useState<Record<string, string>>({});
  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;
    // Rule: Name Required
    if (!formData.name.trim()) {
      errors.name = "Category name is required.";
      isValid = false;
    }
    // Rule: Description Max Length
    if (formData.description.length > 100) {
      errors.description = "Description is too long (max 100 chars).";
      isValid = false;
    }
    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});

    try {
      if (isEditMode) {
        const payload: CategoryRequest = {
          name: formData.name,
          description: formData.description,
          status: formData.status,
          parentCategoryId:
            formData.parentCategoryId !== ""
              ? Number(formData.parentCategoryId)
              : null,
        };
        await categoryService.update(initialData.id, payload);
        toast.success("Category updated successfully!");
      } else {
        const payload: CategoryRequest = {
          name: formData.name,
          description: formData.description,
          status: formData.status,
          parentCategoryId:
            formData.parentCategoryId !== ""
              ? Number(formData.parentCategoryId)
              : null,
        };
        await categoryService.create(payload);
        toast.success("Category created successfully!");
      }
      router.refresh();
      onSuccess();
      setFormData({
        name: "",
        description: "",
        status: "ACTIVE",
        parentCategoryId: "",
      });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.validationErrors) {
          setErrors(error.validationErrors);
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper to update state and clear error for that field
  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error immediately when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form id={"tableForm"} onSubmit={handleSubmit} className={"mt-4 space-y-6"}>
      {/* Name Input */}
      <div>
        <Label>Category Name</Label>
        <Input
          type="text"
          placeholder={"e.g. Electronics"}
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={!!errors.name}
          hint={errors.name}
        />
      </div>
      {/* Description Input */}
      <div>
        <Label>Category Description</Label>
        <Input
          type="text"
          placeholder={"Describe your category"}
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          error={!!errors.description}
          hint={errors.description}
        />
      </div>
      {/* Checkbox */}
      <div className="flex items-center gap-3">
        <Checkbox
          checked={formData.status === "ACTIVE"}
          onChange={(isChecked) =>
            handleChange("status", isChecked ? "ACTIVE" : "INACTIVE")
          }
        />
        <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
          Active
        </span>
      </div>
      {/* Select */}
      <div>
        <Label className={`${isRoot ? "opacity-50" : ""}`}>
          Parent Category
        </Label>
        <Select
          disabled={isRoot}
          placeholder={"Select parent category"}
          defaultValue={formData.parentCategoryId}
          options={parentOptions}
          onChange={(selected) => handleChange("parentCategoryId", selected)}
          hint="If you leave this empty, the new category will be a root category"
        />
      </div>
    </form>
  );
}

export function ModalCategoryForm({ data }: { data: Category[] }) {
  const [loading, setLoading] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedCategory, setSelectedCategory] = useState<
    SubCategory | undefined
  >(undefined);
  const handleEdit = (item: Category | SubCategory) => {
    // Cast to Category type so we can add properties safely
    const fullItem = { ...item } as SubCategory;
    // If it's a category (missing parentId), set to null
    if (!fullItem.parentCategoryId) {
      fullItem.parentCategoryId = null;
    }
    setSelectedCategory(fullItem);
    openModal();
  };
  const headers = useMemo(() => getCategoryHeaders(handleEdit), []);
  const subheaders = useMemo(() => getSubCategoryHeaders(handleEdit), []);

  return (
    <div>
      <div className={"pt-6 pl-6"}>
        <NoControlModalBox
          startIcon={<Plus size={16} />}
          openBtnTitle={"New Category"}
          formId={"tableForm"}
          isLoading={loading}
          isOpen={isOpen}
          onOpen={() => {
            setSelectedCategory(undefined);
            openModal();
          }}
          onClose={closeModal}
          modalContent={
            <CategoryForm
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
