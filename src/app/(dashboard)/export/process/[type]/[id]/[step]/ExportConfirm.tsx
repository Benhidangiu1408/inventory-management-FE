"use client";

import OrderSummary from "@/components/TA_common/OrderSummary";
import TableBox from "@/components/TA_common/TableBox";
import Button from "@/default_components/ui/button/Button";
import { ExportConfirmRow } from "@/interfaces/interface.table";
import { Column, TableProps } from "@/components/table/CustomizableTable";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GeneralInfoSection from "@/components/GeneralInformation";

export default function ExportConfirm() {
  const columns: Column<ExportConfirmRow>[] = [
    { key: "batchId", label: "Batch ID" },
    { key: "productName", label: "Product Name" },
    { key: "currentStock", label: "Current Stock" },
    { key: "actualQuantity", label: "Actual Quantity" },
    { key: "location", label: "Location" },
    { key: "totalValue", label: "Total Value" },
    { key: "reason", label: "Reason" },
  ];

  const data: ExportConfirmRow[] = [
    {
      batchId: "1234567890",
      productName: "Product Name",
      currentStock: 100,
      actualQuantity: 100,
      location: "Location",
      totalValue: 100,
      reason: "Reason",
    },
    {
      batchId: "1234567890",
      productName: "Product Name",
      currentStock: 100,
      actualQuantity: 100,
      location: "Location",
      totalValue: 100,
      reason: "Reason",
    },
  ];

  const tableProps: TableProps<ExportConfirmRow> = {
    headers: columns,
    data,
  };

  return (
    <div className="flex gap-6">
      <div className="flex flex-3 flex-col gap-6">
        <GeneralInfoSection
          items={[
            { label: "Stock-out Code", value: "SO-2025-001" },
            { label: "Stock-out Date", value: "2025-01-01" },
            { label: "Stock-out By", value: "John Doe" },
            { label: "Customer", value: "Customer 1" },
          ]}
        />
        <TableBox title="Export Confirm" table={tableProps} />
      </div>
      <div className="flex flex-1 flex-col gap-6">
        <OrderSummary />
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg">Confirmation</h2>
          <Button className="w-full" size="md">
            <FontAwesomeIcon icon={faArrowRight} /> Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
