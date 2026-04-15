"use client";

import { Column } from "@/components/table/CustomizableTable";
import {
  Category,
  ProductResponse,
  SubCategory,
  VariantAttributeResponse,
  VariantResponse,
} from "@/interfaces/warehouseManagementType";
import { AlertCircle, CheckCircle, Pencil, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  InventoryCheckBatchRow,
  InventoryCheckProductGroup,
} from "@/interfaces/inventoryManagementType";
import Input from "@/default_components/form/input/InputField";
import Checkbox from "@/default_components/form/input/Checkbox";
import Image from "next/image";

// Category header
export const getCategoryHeaders = (
  onEdit: (category: Category) => void,
  onDelete: (id: number) => void,
  disable: boolean,
): Column<Category>[] => [
  {
    label: "Code",
    key: "code",
    width: 100,
    sort: true,
    filter: "agTextColumnFilter",
  },
  {
    label: "Category Name",
    key: "name",
    filter: "agTextColumnFilter",
    width: 300,
  },
  {
    label: "Description",
    key: "description",
    filter: "agTextColumnFilter",
    autoHeight: true,
    render: (val) =>
      (val as string) || (
        <span className="text-gray-400 italic">No description</span>
      ),
  },
  {
    label: "Actions",
    key: "id",
    width: 50,
    filter: false,
    render: (_, row) => (
      <div className="flex h-full items-center justify-center gap-2">
        <button onClick={() => onEdit(row)} disabled={disable}>
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete(row.id)}
          disabled={disable}
          className="text-red-500 transition-colors hover:text-red-700"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ),
  },
];
// Child Table Headers (Sub-Category)
export const getSubCategoryHeaders = (
  onEdit: (category: SubCategory) => void,
  onDelete: (id: number) => void,
  disable: boolean,
): Column<SubCategory>[] => [
  {
    label: "Code",
    key: "code",
    sort: true,
    width: 190,
    filter: "agTextColumnFilter",
  },
  {
    label: "Subcategory Name",
    key: "name",
    width: 300,
    filter: "agTextColumnFilter",
  },
  {
    label: "Description",
    key: "description",
    filter: "agTextColumnFilter",
    autoHeight: true,
    render: (val) =>
      (val as string) || (
        <span className="text-gray-400 italic">No description</span>
      ),
  },
  {
    label: "Actions",
    key: "id",
    filter: false,
    width: 50,
    render: (_, row) => (
      <div className="flex h-full items-center justify-center gap-2">
        <button onClick={() => onEdit(row)} disabled={disable}>
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete(row.id)}
          disabled={disable}
          className="text-red-500 transition-colors hover:text-red-700"
        >
          <Trash2 size={16} />
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
    sort: true,
    filter: "agTextColumnFilter",
    width: 50,
    render: (value, row) => (
      <Link
        href={`/catalog/product/detail/${row.id}`}
        className="text-brand-500 dark:text-brand-500 text-sm font-normal underline transition-colors"
      >
        {value as string}
      </Link>
    ),
  },
  {
    label: "Product Name",
    key: "name",
    filter: "agTextColumnFilter",
    width: 200,
  },
  {
    label: "Category",
    key: "categoryName",
    filter: "agTextColumnFilter",
    width: 200,
  },
  {
    label: "Base Unit",
    key: "baseUnit",
    width: 100,
    valueGetter: (row) => `${row.baseUnit.name} (${row.baseUnit.abb})`,
  },
  {
    label: "Description",
    key: "description",
    filter: "agTextColumnFilter",
    autoHeight: true,
    render: (val) =>
      (val as string) || (
        <span className="text-gray-400 italic">No description</span>
      ),
  },
];

// Child Table Headers (Product Variants)
export const getSubVariantHeaders = (
  onImageClick: (imageUrl: string) => void,
): Column<VariantResponse>[] => [
  {
    label: "Variant Code",
    key: "code",
    sort: true,
    filter: "agTextColumnFilter",
    width: 200,
  },
  {
    label: "Image",
    key: "image",
    filter: false,
    sortable: false,
    width: 100,
    render: (val) =>
      val ? (
        <button
          type="button"
          className="h-full overflow-hidden rounded border border-gray-200 transition-opacity hover:opacity-80 dark:border-gray-700"
          onClick={() => onImageClick(val as string)}
        >
          <Image
            src={val as string}
            width={32}
            height={32}
            alt="Variant thumbnail"
            className="object-cover"
          />
        </button>
      ) : (
        <span className="text-xs text-gray-400 italic">No image</span>
      ),
  },
  {
    label: "Attributes",
    key: "attributes",
    filter: false,
    render: (attrs) => {
      const attributeArray = attrs as VariantAttributeResponse[];
      if (!Array.isArray(attributeArray) || attributeArray.length === 0)
        return <span className="text-gray-400 italic">Default</span>;
      return (
        <div className="flex h-full w-full flex-wrap items-center justify-center gap-1 py-1">
          {attributeArray.map((attr) => (
            <span
              key={attr.attributeId}
              className="inline-flex items-center rounded border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
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
    label: "Description",
    key: "description",
    filter: "agTextColumnFilter",
    autoHeight: true,
    render: (val) =>
      (val as string) || (
        <span className="text-gray-400 italic">No description</span>
      ),
  },
];

// Inventory Check Detail
const BatchInputCell = ({
  row,
  onChange,
}: {
  row: InventoryCheckBatchRow;
  onChange: (
    detailId: number,
    field: "draftQuantity" | "draftFaults",
    value: number | boolean,
  ) => void;
}) => {
  const currentVal =
    row.draftQuantity !== undefined ? row.draftQuantity : row.scannedQuantity;
  // It is dirty if the draft is different from the saved database value
  const isDirty = currentVal !== row.scannedQuantity;

  return (
    <div className="flex h-full items-center">
      <Input
        type="text"
        inputMode="numeric"
        defaultValue={currentVal ?? ""}
        onBlur={(e) =>
          onChange(row.detailId, "draftQuantity", Number(e.target.value))
        }
        placeholder="0"
        className="!h-8"
        // Show visual feedback based on state
        success={!isDirty && row.scannedQuantity !== null}
        error={isDirty}
      />
    </div>
  );
};

const BatchFaultCell = ({
  row,
  onChange,
}: {
  row: InventoryCheckBatchRow;
  onChange: (
    detailId: number,
    field: "draftQuantity" | "draftFaults",
    value: number | boolean,
  ) => void;
}) => {
  const currentVal =
    row.draftFaults !== undefined ? row.draftFaults : row.hasFaults;
  // It is dirty if the draft is different from the saved database value
  const isDirty = currentVal !== row.hasFaults;
  return (
    <div className="flex h-full items-center justify-center">
      <Checkbox
        checked={currentVal}
        onChange={(e) =>
          onChange(row.detailId, "draftFaults", e.target.checked)
        }
        className="flex items-center justify-center"
        error={isDirty}
      />
    </div>
  );
};

const BatchActionCell = ({
  row,
  onSave,
  loading,
}: {
  row: InventoryCheckBatchRow;
  onSave: (detailId: number, qty: number, hasFaults: boolean) => void;
  loading: boolean;
}) => {
  const qtyToSave =
    row.draftQuantity !== undefined ? row.draftQuantity : row.scannedQuantity;
  const faultsToSave =
    row.draftFaults !== undefined ? row.draftFaults : row.hasFaults;
  const isDirty =
    qtyToSave !== row.scannedQuantity || faultsToSave !== row.hasFaults;

  return (
    <div className="flex h-full items-center justify-center">
      <button
        onClick={() => {
          onSave(row.detailId, Number(qtyToSave), Boolean(faultsToSave));
        }}
        disabled={loading || !isDirty}
        className="hover:bg-brand-50 hover:text-brand-600 inline-flex items-center justify-center rounded-lg p-1.5 text-gray-500 disabled:opacity-50 dark:hover:bg-gray-800"
      >
        {loading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <Save
            size={18}
            className={isDirty ? "text-blue-600" : "text-gray-400"}
          />
        )}
      </button>
    </div>
  );
};
const BatchVarianceCell = ({ row }: { row: InventoryCheckBatchRow }) => {
  // If not scanned yet, show placeholder
  if (row.scannedQuantity === null) {
    return <span>-</span>;
  }
  const diff = row.scannedQuantity - row.storedQuantity;
  const isMatch = diff === 0;
  return (
    <div
      className={`flex h-full items-center justify-center ${
        isMatch
          ? "text-success-700 dark:text-success-400"
          : "text-error-700 dark:text-error-400"
      }`}
    >
      {diff > 0 ? `+${diff}` : diff}
    </div>
  );
};

export const icSheetProductHeaders: Column<InventoryCheckProductGroup>[] = [
  {
    label: "Code",
    key: "productSku",
    width: 100,
    filter: "agTextColumnFilter",
    sort: true,
  },
  {
    label: "Product Name",
    key: "productName",
    width: 300,
    filter: "agTextColumnFilter",
  },
  {
    label: "Description",
    key: "description",
    filter: "agTextColumnFilter",
    autoHeight: true,
    render: (val) =>
      (val as string) || (
        <span className="text-gray-400 italic">No description</span>
      ),
  },
  {
    label: "Unit",
    key: "unitName",
    width: 100,
  },
  {
    label: "Progress",
    key: "batches",
    render: (batches) => {
      const list = batches as InventoryCheckBatchRow[];
      const total = list.length;
      const counted = list.filter((b) => b.scannedQuantity !== null).length;
      const isComplete = total > 0 && total === counted;

      return (
        <div className="flex h-full items-center justify-center gap-2">
          <span
            className={`text-sm font-medium ${
              isComplete ? "text-success-600" : "text-gray-500"
            }`}
          >
            {counted} / {total} Batches
          </span>
          {isComplete && <CheckCircle size={16} className="text-success-500" />}
        </div>
      );
    },
  },
];

// --- CHILD HEADERS (Batches) ---
export const getIcSheetBatchSubheaders = (
  loading: boolean,
  onSave: (detailId: number, qty: number, hasFaults: boolean) => void,
  onChange: (
    detailId: number,
    field: "draftQuantity" | "draftFaults",
    value: number | boolean,
  ) => void,
): Column<InventoryCheckBatchRow>[] => [
  {
    label: "Batch Code",
    key: "batchCode",
    width: 100,
    filter: "agTextColumnFilter",
  },
  {
    label: "Location",
    key: "locationCode",
    filter: "agTextColumnFilter",
    sort: true,
    width: 250,
  },
  {
    label: "System Qty",
    key: "storedQuantity",
    width: 50,
    filter: false,
  },
  {
    label: "Scanned Qty",
    key: "scannedQuantity",
    sortable: false,
    filter: false,
    render: (_, row) => <BatchInputCell row={row} onChange={onChange} />,
  },
  {
    label: "Variance",
    key: "scannedQuantity",
    width: 50,
    sortable: false,
    filter: false,
    render: (_, row) => <BatchVarianceCell row={row} />,
  },
  {
    label: "Faulty",
    width: 50,
    key: "hasFaults",
    sortable: false,
    render: (_, row) => <BatchFaultCell row={row} onChange={onChange} />,
  },
  {
    label: "Action",
    key: "detailId",
    sortable: false,
    width: 50,
    filter: false,
    render: (_, row) => (
      <BatchActionCell row={row} onSave={onSave} loading={loading} />
    ),
  },
];
// Read only
export const icSheetBatchSubheadersReadOnly: Column<InventoryCheckBatchRow>[] =
  [
    {
      label: "Batch Code",
      key: "batchCode",
      width: 100,
      filter: "agTextColumnFilter",
    },
    {
      label: "Location",
      key: "locationCode",
      filter: "agTextColumnFilter",
      sort: true,
    },
    {
      label: "System Qty",
      key: "storedQuantity",
      width: 50,
      filter: false,
    },
    {
      label: "Scanned Qty",
      key: "scannedQuantity",
      sortable: false,
      width: 50,
      filter: false,
      render: (val) => (
        <span className="font-bold text-gray-900 dark:text-white">
          {val !== null ? (val as number) : "-"}
        </span>
      ),
    },
    {
      label: "Variance",
      key: "scannedQuantity",
      sortable: false,
      width: 50,
      filter: false,
      render: (_, row) => <BatchVarianceCell row={row} />,
    },
    {
      label: "Faulty",
      key: "hasFaults",
      sortable: false,
      width: 50,
      render: (val) => (
        <div className="flex h-full items-center justify-center">
          {val ? (
            <AlertCircle size={18} className="text-error-500" />
          ) : (
            <span className="text-gray-300">-</span>
          )}
        </div>
      ),
    },
  ];
