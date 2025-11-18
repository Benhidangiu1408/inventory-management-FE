import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import ActivityLog from "@/default_components/TA_common/ActivityLog";

import UtilityBar from "@/default_components/TA_common/UtilityBar";
import GeneralInfoSection from "@/default_components/Ky_components/GeneralInformation";
import ExpandableTable from "@/default_components/Ky_components/ExpandableTable";
import {
  warehouseBatchColumns,
  warehouseProductColumns,
} from "@/default_components/Ky_components/ExpandableTableHeaders";
import { warehouseProducts } from "@/default_components/Ky_components/TableData";

export default function WarehouseDetailPage() {
  const generalInfoItems = [
    {
      label: "Warehouse Code",
      value: "WH-001",
    },
    {
      label: "Warehouse Name",
      value: "Warehouse 1",
    },
    {
      label: "Location",
      value: "Los Angeles",
    },
    {
      label: "Manager",
      value: "John Doe",
    },
    {
      label: "Status",
      value: "Active",
    },
    {
      label: "Type",
      value: "Temporary Storage",
    },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Warehouse Detail" />
      <div className="flex flex-col gap-6">
        <UtilityBar />
        <div className="flex justify-between gap-6">
          <div className="flex flex-3 flex-col gap-6">
            <GeneralInfoSection
              title="General Information"
              items={generalInfoItems}
            />
            <div className="rounded-2xl border border-gray-200 p-6">
              <ExpandableTable
                headers={warehouseProductColumns}
                subTableHeaders={warehouseBatchColumns}
                data={warehouseProducts}
                subTableData="batches"
                needCheckBox={false}
                title="Warehouse Storage"
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-6">
            <ActivityLog />
          </div>
        </div>
      </div>
    </div>
  );
}
