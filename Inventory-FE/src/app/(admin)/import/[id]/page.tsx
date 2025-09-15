import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableBox from "@/components/TA_common/TableBox";
import UtilityBar from "@/components/TA_common/UtilityBar";
import {
  Column,
  ProductRow,
  StorageLocationRow,
  TableProps,
} from "@/interfaces/interface.table";
import ActivityLog from "@/components/TA_common/ActivityLog";
import GeneralInformation from "@/components/TA_common/GeneralInformation";
import Badge from "@/components/ui/badge/Badge";

export default function ImportDetailPage() {
  const productColumn: Column<ProductRow>[] = [
    {
      key: "batchId",
      header: "Batch ID",
    },
    {
      key: "productName",
      header: "Product Name",
    },
    {
      key: "expectedQuantity",
      header: "Expected Quantity",
    },
    {
      key: "actualQuantity",
      header: "Actual Quantity",
    },
    {
      key: "totalValue",
      header: "Total Value",
    },
    {
      key: "qcResult",
      header: "QC Result",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (value: ProductRow[keyof ProductRow], row: ProductRow) =>
        value.toString().toLowerCase() === "pass" ? (
          <Badge color="success">{value}</Badge>
        ) : (
          <Badge color="error">{value}</Badge>
        ),
    },
    {
      key: "reason",
      header: "Reason",
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

  const storageLocationColumn: Column<StorageLocationRow>[] = [
    {
      key: "batchId",
      header: "Batch ID",
    },
    {
      key: "productName",
      header: "Product Name",
    },
    {
      key: "expectedQuantity",
      header: "Expected Quantity",
    },
    {
      key: "actualQuantity",
      header: "Actual Quantity",
    },
    {
      key: "storageLocation",
      header: "Storage Location",
    },
  ];

  const storageLocationData: StorageLocationRow[] = [
    {
      batchId: "1234567891",
      productName: "Product 1",
      expectedQuantity: 100,
      actualQuantity: 100,
      storageLocation: "Storage Location 1",
    },
    {
      batchId: "1234567892",
      productName: "Product 2",
      expectedQuantity: 100,
      actualQuantity: 100,
      storageLocation: "Storage Location 2",
    },
    {
      batchId: "1234567893",
      productName: "Product 3",
      expectedQuantity: 100,
      actualQuantity: 100,
      storageLocation: "Storage Location 3",
    },
  ];

  const productTableProps: TableProps<ProductRow> = {
    columns: productColumn,
    data: productData,
  };

  const storageLocationTableProps: TableProps<StorageLocationRow> = {
    columns: storageLocationColumn,
    data: storageLocationData,
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Import Detail" />
      <div className="flex flex-col gap-6">
        <UtilityBar />
        <div className="flex justify-between gap-6">
          <div className="flex flex-3 flex-col gap-6">
            <GeneralInformation />
            <TableBox<ProductRow>
              title="Product List"
              table={productTableProps}
            />
            <TableBox<StorageLocationRow>
              title="Storage Location List"
              table={storageLocationTableProps}
            />
          </div>
          <div className="flex-1">
            <ActivityLog />
          </div>
        </div>
      </div>
    </div>
  );
}
