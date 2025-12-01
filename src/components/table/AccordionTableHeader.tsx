"use client";

import { Column } from "@/components/table/CustomizableTable";
import { Category, SubCategory } from "@/interfaces/warehouseManagementType";
import Badge from "@/default_components/ui/badge/Badge";
import { Pencil } from "lucide-react";

// Category header
export const getCategoryHeaders = (
  onEdit: (category: Category) => void,
): Column<Category>[] => [
  {
    label: "Code",
    key: "code",
  },
  {
    label: "Category Name",
    key: "name",
    width: 250,
  },
  {
    label: "Status",
    key: "status",
    // Custom Render for Status Badge
    render: (value) => (
      <Badge variant={"solid"} color={value === "ACTIVE" ? "success" : "error"}>
        {value as string}
      </Badge>
    ),
  },
  {
    label: "Description",
    key: "description",
    render: (val) =>
      (val as string) || (
        <span className="text-gray-400 italic">No description</span>
      ),
  },
  {
    label: "Actions",
    key: "id",
    render: (_, row) => (
      <div className="flex h-full items-center justify-center gap-2">
        <button onClick={() => onEdit(row)}>
          <Pencil size={16} />
        </button>
      </div>
    ),
  },
];
// --- 2. Child Table Headers (Sub-Category) ---
export const getSubCategoryHeaders = (
  onEdit: (category: SubCategory) => void,
): Column<SubCategory>[] => [
  { label: "Code", key: "code" },
  { label: "Subcategory Name", key: "name", width: 250 },
  {
    label: "Status",
    key: "status",
    // Custom Render for Status Badge
    render: (value) => (
      <Badge variant={"solid"} color={value === "ACTIVE" ? "success" : "error"}>
        {value as string}
      </Badge>
    ),
  },
  {
    label: "Description",
    key: "description",
    render: (val) =>
      (val as string) || (
        <span className="text-gray-400 italic">No description</span>
      ),
  },
  {
    label: "Actions",
    key: "id",
    width: 80,
    render: (_, row) => (
      <div className="flex h-full items-center justify-center gap-2">
        <button onClick={() => onEdit(row)}>
          <Pencil size={16} />
        </button>
      </div>
    ),
  },
];
