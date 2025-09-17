import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UtilityBar from "@/components/TA_common/UtilityBar";
import GeneralInfoSection from "@/components/Ky_components/GeneralInformation";
import { Column } from "@/components/Ky_components/CustomizableTable";
import ExpandableTable from "@/components/Ky_components/ExpandableTable";

type Batch = {
  code: string;
  scannedQty: number;
  systemQty: number;
  scannedBy: string;
  note: string;
  status: "scanning" | "confirmed";
};

type Product = {
  id: string;
  name: string;
  scannedTotalQty: number;
  systemTotalQty: number;
  unit: string;
  difference: number;
  batches: Batch[];
};

const productColumns: Column<Product>[] = [
  { label: "Product Name", key: "name" },
  { label: "Total Scanned Quantity", key: "scannedTotalQty" },
  { label: "Total System Quantity", key: "systemTotalQty" },
  { label: "Unit", key: "unit" },
  { label: "Difference", key: "difference" },
];

const batchColumns: Column<Batch>[] = [
  { label: "Batch Code", key: "code" },
  { label: "Scanned Quantity", key: "scannedQty" },
  { label: "System Quantity", key: "systemQty" },
  { label: "Note", key: "note" },
  { label: "Status", key: "status" },
];

const productData: Product[] = [
  {
    id: "P-001",
    name: "Widget A",
    scannedTotalQty: 145,
    systemTotalQty: 150,
    unit: "pcs",
    difference: -5,
    batches: [
      {
        code: "A-BATCH-01",
        scannedQty: 50,
        systemQty: 50,
        scannedBy: "Alice",
        note: "One item is dent",
        status: "confirmed",
      },
      {
        code: "A-BATCH-02",
        scannedQty: 45,
        systemQty: 50,
        scannedBy: "Bob",
        note: "Filing for investigation",
        status: "confirmed",
      },
      {
        code: "A-BATCH-03",
        scannedQty: 50,
        systemQty: 50,
        scannedBy: "Charlie",
        note: "",
        status: "scanning",
      },
    ],
  },
  {
    id: "P-002",
    name: "Gadget B",
    scannedTotalQty: 80,
    systemTotalQty: 78,
    unit: "boxes",
    difference: 2,
    batches: [
      {
        code: "B-BATCH-01",
        scannedQty: 40,
        systemQty: 39,
        scannedBy: "Diana",
        note: "1 extra, return to supplier",
        status: "confirmed",
      },
      {
        code: "B-BATCH-02",
        scannedQty: 40,
        systemQty: 39,
        scannedBy: "Evan",
        note: "1 extra, move to error warehouse",
        status: "confirmed",
      },
    ],
  },
  {
    id: "P-003",
    name: "Component C",
    scannedTotalQty: 200,
    systemTotalQty: 200,
    unit: "kg",
    difference: 0,
    batches: [
      {
        code: "C-BATCH-01",
        scannedQty: 100,
        systemQty: 100,
        scannedBy: "Fiona",
        note: "",
        status: "confirmed",
      },
      {
        code: "C-BATCH-02",
        scannedQty: 100,
        systemQty: 100,
        scannedBy: "George",
        note: "",
        status: "scanning",
      },
    ],
  },
];

export default async function InventoryCheckDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return (
    <div>
      <PageBreadcrumb pageTitle="Inventory Check Detail" />
      <div className="flex flex-col gap-6">
        <UtilityBar />
        <div className="flex justify-between gap-6">
          <div className="flex flex-3 flex-col gap-6">
            <GeneralInfoSection
              items={[
                { label: "Audit Code", value: id },
                { label: "Scheduled Date", value: "2025-01-01" },
                { label: "Assigned Inspector", value: "John Doe" },
                { label: "Created By", value: "Joe Dohn" },
                { label: "Warehouse", value: "Warehouse 1" },
              ]}
            />
          </div>
        </div>
        <ExpandableTable<Product, Batch>
          headers={productColumns}
          subTableHeaders={batchColumns}
          data={productData}
          subTableData="batches"
        ></ExpandableTable>
      </div>
    </div>
  );
}
