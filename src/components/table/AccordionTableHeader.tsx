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
import { AlertCircle, CheckCircle, Pencil, Plus, Save } from "lucide-react";
import Link from "next/link";
import {
  InventoryCheckBatchRow,
  InventoryCheckProductGroup,
} from "@/interfaces/inventoryManagementType";
import { useEffect, useEffectEvent, useState } from "react";
import Input from "@/default_components/form/input/InputField";
import Checkbox from "@/default_components/form/input/Checkbox";
import { inventoryCheckService } from "@/services/InventoryManagementService";
import { ApiError } from "@/lib/api-mask";
import toast from "react-hot-toast";

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

// Inventory Check Detail
const BatchInputCell = ({ row }: { row: InventoryCheckBatchRow }) => {
  const [val, setVal] = useState(row.scannedQuantity?.toString() ?? "");
  const set = useEffectEvent(() =>
    setVal((prev) => {
      const next = row.scannedQuantity?.toString() ?? "";
      return prev !== next ? next : prev;
    }),
  );
  useEffect(() => {
    set();
  }, [row.scannedQuantity]);
  const isDirty = val !== (row.scannedQuantity?.toString() ?? "");

  return (
    <div className="flex h-full items-center">
      <Input
        type="number"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="0"
        className="!h-8 text-right font-mono text-sm"
        // Show visual feedback based on state
        success={!isDirty && row.scannedQuantity !== null}
        error={isDirty ? true : false}
        data-detail-id={row.detailId}
        data-new-value={val}
      />
    </div>
  );
};

const BatchFaultCell = ({ row }: { row: InventoryCheckBatchRow }) => {
  const [checked, setChecked] = useState(row.hasFaults);
  const set = useEffectEvent(() =>
    setChecked((prev) => {
      return prev !== row.hasFaults ? row.hasFaults : prev;
    }),
  );
  useEffect(() => {
    set();
  }, [row.hasFaults]);
  return (
    <div className="flex h-full items-center justify-center">
      <Checkbox
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        data-detail-id={row.detailId}
        data-fault-status={checked}
        className="flex items-center justify-center"
      />
    </div>
  );
};

const BatchActionCell = ({
  row,
  onSave,
  employeeId,
}: {
  row: InventoryCheckBatchRow;
  onSave: (detailId: number, qty: number, hasFaults: boolean) => void;
  employeeId: number;
}) => {
  const [loading, setLoading] = useState(false);
  const handleSave = async () => {
    const currentUser = sessionStorage.getItem("userId");
    if (Number(currentUser) !== employeeId) {
      toast.error("You're not the assigned employee!");
      return;
    }
    const input = document.querySelector(
      `input[data-detail-id="${row.detailId}"]`,
    ) as HTMLInputElement;
    const checkbox = document.querySelector(
      `input[data-detail-id="${row.detailId}"][type="checkbox"]`,
    ) as HTMLInputElement;

    try {
      setLoading(true);
      await inventoryCheckService.submit({
        detailId: Number(row.detailId),
        scannedQuantity: Number(input.value),
        hasFaults: checkbox.checked,
      });
      onSave(Number(row.detailId), Number(input.value), checkbox.checked);
      toast.success("Inventory Check Detail Submitted");
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
    <div className="flex h-full items-center justify-center">
      <button
        onClick={handleSave}
        disabled={loading}
        className="hover:bg-brand-50 hover:text-brand-600 inline-flex items-center justify-center rounded-lg p-1.5 text-gray-500 disabled:opacity-50 dark:hover:bg-gray-800"
        title="Save Result"
      >
        {loading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <Save size={18} />
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
    label: "Product Info",
    key: "productName",
    render: (_, row) => (
      <div className="flex flex-col justify-center py-1">
        <span className="font-semibold text-gray-900 dark:text-white">
          {row.productName}
        </span>
        <span className="text-xs text-gray-500">{` (${row.productSku})`}</span>
      </div>
    ),
  },
  {
    label: "Unit",
    key: "unitName",
    render: (val) => (
      <span className="text-sm text-gray-600">{val as string}</span>
    ),
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
  onSave: (detailId: number, qty: number, hasFaults: boolean) => void,
  employeeId: number,
): Column<InventoryCheckBatchRow>[] => [
  {
    label: "Location",
    key: "locationCode",
    width: 250,
    render: (val) => (
      <span className="font-mono text-sm font-medium text-gray-700 dark:text-gray-300">
        {val as string}
      </span>
    ),
  },
  {
    label: "Batch Code",
    key: "batchCode",
    render: (val) => (
      <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
        {val as string}
      </span>
    ),
  },
  {
    label: "System Qty",
    key: "storedQuantity",
    render: (val) => (
      <span className="font-mono font-medium text-gray-900 dark:text-white">
        {val as number}
      </span>
    ),
  },
  {
    label: "Scanned Qty",
    key: "scannedQuantity",
    sortable: false,
    render: (_, row) => <BatchInputCell row={row} />,
  },
  {
    label: "Variance",
    key: "scannedQuantity",
    sortable: false,
    render: (_, row) => <BatchVarianceCell row={row} />,
  },
  {
    label: "Faulty",
    key: "hasFaults",
    sortable: false,
    render: (_, row) => <BatchFaultCell row={row} />,
  },
  {
    label: "Action",
    key: "detailId",
    sortable: false,
    render: (_, row) => (
      <BatchActionCell row={row} onSave={onSave} employeeId={employeeId} />
    ),
  },
];
// Read only
export const icSheetBatchSubheadersReadOnly: Column<InventoryCheckBatchRow>[] =
  [
    {
      label: "Location",
      key: "locationCode",
      width: 250,
      render: (val) => (
        <span className="font-mono text-sm font-medium text-gray-700 dark:text-gray-300">
          {val as string}
        </span>
      ),
    },
    {
      label: "Batch Code",
      key: "batchCode",
      render: (val) => (
        <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
          {val as string}
        </span>
      ),
    },
    {
      label: "System Qty",
      key: "storedQuantity",
      render: (val) => (
        <span className="font-mono font-medium text-gray-900 dark:text-white">
          {val as number}
        </span>
      ),
    },
    {
      label: "Scanned Qty",
      key: "scannedQuantity",
      render: (val) => (
        <span className="font-mono font-bold text-gray-900 dark:text-white">
          {val !== null ? (val as number) : "-"}
        </span>
      ),
    },
    {
      label: "Variance",
      key: "scannedQuantity",
      render: (_, row) => <BatchVarianceCell row={row} />,
    },
    {
      label: "Faulty",
      key: "hasFaults",
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
