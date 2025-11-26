"use client";

import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import TableBox from "@/default_components/TA_common/TableBox";
import UtilityBar from "@/default_components/TA_common/UtilityBar";
import { ProductRow, StorageLocationRow } from "@/interfaces/interface.table";
import ActivityLog from "@/default_components/TA_common/ActivityLog";
import Badge from "@/default_components/ui/badge/Badge";
import { Column, TableProps } from "@/components/table/CustomizableTable";
import GeneralInfoSection from "@/default_components/Ky_components/GeneralInformation";

export default function ImportDetailPage() {
  const generalInfoItems = [
    {
      label: "Import ID",
      value: "1234567891",
    },
    {
      label: "Import Date",
      value: "2021-01-01",
    },
    {
      label: "Import Status",
      value: "Pending",
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

  const storageLocationColumn: Column<StorageLocationRow>[] = [
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
      key: "storageLocation",
      label: "Storage Location",
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
    headers: productColumn,
    data: productData,
  };

  const storageLocationTableProps: TableProps<StorageLocationRow> = {
    headers: storageLocationColumn,
    data: storageLocationData,
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Import Detail" filters={["details"]} />
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
