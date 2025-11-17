import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ActivityLog from "@/components/TA_common/ActivityLog";
import OrderSummary from "@/components/TA_common/OrderSummary";
import TableBox from "@/components/TA_common/TableBox";
import UtilityBar from "@/components/TA_common/UtilityBar";
import Badge from "@/components/ui/badge/Badge";
import { ProductRow } from "@/interfaces/interface.table";
import {
  Column,
  TableProps,
} from "@/components/Ky_components/CustomizableTable";
import GeneralInfoSection from "@/components/Ky_components/GeneralInformation";
import StatusBox from "@/components/TA_common/StatusBox";

export default function ExportDetailPage() {
  const generalInfoItems = [
    {
      label: "Export ID",
      value: "1234567891",
    },
    {
      label: "Export Date",
      value: "2021-01-01",
    },
    {
      label: "Export Status",
      value: "Pending",
    },
    {
      label: "Export By",
      value: "John Doe",
    },
  ];

  const productColumn: Column<ProductRow>[] = [
    {
      key: "batchId",
      label: "Batch ID",
    },
    {
      key: "productName",
      label: "Product Name",
    },
    {
      key: "expectedQuantity",
      label: "Expected Quantity",
    },
    {
      key: "actualQuantity",
      label: "Actual Quantity",
    },
    {
      key: "totalValue",
      label: "Total Value",
    },
    {
      key: "qcResult",
      label: "QC Result",
      render: (value: ProductRow[keyof ProductRow]) =>
        value.toString().toLowerCase() === "pass" ? (
          <Badge color="success">{value}</Badge>
        ) : (
          <Badge color="error">{value}</Badge>
        ),
    },
    {
      key: "reason",
      label: "Reason",
    },
  ];

  const productData: ProductRow[] = [
    {
      batchId: "1234567891",
      productName: "Product 1",
      expectedQuantity: 100,
      actualQuantity: 100,
      totalValue: 10000,
      qcResult: "Pass",
      reason: "Reason 1",
    },
    {
      batchId: "1234567892",
      productName: "Product 2",
      expectedQuantity: 100,
      actualQuantity: 100,
      totalValue: 10000,
      qcResult: "Pass",
      reason: "Reason 2",
    },
    {
      batchId: "1234567893",
      productName: "Product 3",
      expectedQuantity: 100,
      actualQuantity: 100,
      totalValue: 10000,
      qcResult: "Pass",
      reason: "Reason 3",
    },
  ];

  const productTableBox: TableProps<ProductRow> = {
    headers: productColumn,
    data: productData,
  };

  return (
    <div>
      <PageBreadcrumb
        pageTitle="Export Detail"
        status={<StatusBox />}
        filters={["details"]}
      />
      <div className="flex flex-col gap-6">
        <UtilityBar />
        <div className="flex justify-between gap-6">
          <div className="flex flex-3 flex-col gap-6">
            <GeneralInfoSection
              title="General Information"
              items={generalInfoItems}
            />
            <TableBox<ProductRow>
              title="Product List"
              table={productTableBox}
            />
          </div>
          <div className="flex flex-1 flex-col gap-6">
            <ActivityLog />
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
