"use client";

import { Column } from "@/components/table/CustomizableTable";
import { Category, SubCategory } from "@/interfaces/warehouseManagementType";
import Badge from "@/default_components/ui/badge/Badge";

// Category header
export const categoryHeaders: Column<Category>[] = [
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
];
// --- 2. Child Table Headers (Sub-Category) ---
export const subCategoryHeaders: Column<SubCategory>[] = [
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
];
