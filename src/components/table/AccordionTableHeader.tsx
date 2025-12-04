"use client";

import { Column } from "@/components/table/CustomizableTable";
import {
  Category,
  ProductResponse,
  SubCategory,
  UnitSummary,
  VariantResponse,
} from "@/interfaces/warehouseManagementType";
import Badge from "@/default_components/ui/badge/Badge";
import { Pencil, Plus } from "lucide-react";
import Link from "next/link";

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
// Child Table Headers (Sub-Category)
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

// Product
export const productHeaders: Column<ProductResponse>[] = [
  {
    label: "Code",
    key: "code",
  },
  {
    label: "Product Name",
    key: "name",
  },
  {
    label: "Category",
    key: "categoryName",
  },
  {
    label: "Base Unit",
    key: "baseUnit",
    render: (unit) => (
      <span>
        {(unit as UnitSummary).name}{" "}
        <span className="text-xs text-gray-400">
          ({(unit as UnitSummary).abb})
        </span>
      </span>
    ),
  },
  {
    label: "Status",
    key: "status",
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
        <Link
          href={`/catalog/product/${row.id}/variant/new`}
          className="text-gray-500 transition-colors hover:text-blue-600"
        >
          <Plus size={16} />
        </Link>
      </div>
    ),
  },
];

// Child Table Headers (Product Variants)
export const variantHeaders: Column<VariantResponse>[] = [
  {
    label: "Variant Code",
    key: "code",
  },
  {
    label: "Attributes",
    key: "attributes",
    // Render List: "Color: Red, Size: XL"
    render: (attrs) => {
      if (!Array.isArray(attrs) || attrs.length === 0)
        return <span className="text-gray-400 italic">Default</span>;

      return (
        <div className="flex-1 flex-wrap justify-center gap-1">
          {attrs.map((attr) => (
            <span
              key={attr.attributeId}
              className="inline-flex items-center rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs text-gray-700"
            >
              <span className="mr-1 font-semibold">{attr.attributeName}:</span>{" "}
              {attr.value}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    label: "Min. Stock",
    key: "minimumQuantity",
    render: (val) => (
      <span className="font-mono font-medium">{val as number}</span>
    ),
  },
  {
    label: "Status",
    key: "status",
    render: (value) => (
      <Badge variant={"solid"} color={value === "ACTIVE" ? "success" : "error"}>
        {value as string}
      </Badge>
    ),
  },
  // {
  //   label: "Actions",
  //   key: "id",
  // render: (_, row) => (
  //   <div className="flex h-full items-center justify-center gap-2">
  //     <button
  //       onClick={() => onEdit(row)}
  //       className="text-gray-500 transition-colors hover:text-blue-600"
  //     >
  //       <Pencil size={16} />
  //     </button>
  //   </div>
  // ),
  // },
];
