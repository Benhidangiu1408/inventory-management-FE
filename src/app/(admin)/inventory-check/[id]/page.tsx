import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import UtilityBar from "@/default_components/TA_common/UtilityBar";
import GeneralInfoSection from "@/default_components/Ky_components/GeneralInformation";
// import ExpandableTable from "@/default_components/Ky_components/AccordionTable";
// import {
//   Product,
//   Batch,
//   productColumns,
//   batchColumns,
// } from "@/default_components/Ky_components/ExpandableTableHeaders";
// import { productData } from "@/default_components/Ky_components/TableData";

export default async function InventoryCheckDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
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
        <div className="rounded-2xl border border-gray-200 p-6">
          {/* <ExpandableTable<Product, Batch>
            headers={productColumns}
            subTableHeaders={batchColumns}
            data={productData}
            subTableData="batches"
            title="Products & Batches"
          ></ExpandableTable> */}
        </div>
      </div>
    </div>
  );
}
