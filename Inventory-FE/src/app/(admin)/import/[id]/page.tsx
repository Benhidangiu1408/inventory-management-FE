import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableBox from "@/components/TA_common/TableBox";
import UtilityBar from "@/components/TA_common/UtilityBar";
import { TableBoxProps } from "@/interfaces/interface.table";
import ActivityLog from "@/components/TA_common/ActivityLog";
import GeneralInformation from "@/components/TA_common/GeneralInformation";

export default function ImportDetailPage() {
  const productTableBox: TableBoxProps = {
    title: "Product",
    headers: [
      "Batch ID",
      "Product Name",
      "Expected Quantity",
      "Actual Quantity",
      "Total Value",
      "QC Result",
      "Reason",
    ],
    data: [
      {
        batchId: "1",
        productName: "Product 1",
        expectedQuantity: 100,
        actualQuantity: 100,
        totalValue: 100,
        qcResult: "Pass",
        reason: "Reason 1",
      },
      {
        batchId: "2",
        productName: "Product 2",
        expectedQuantity: 200,
        actualQuantity: 200,
        totalValue: 200,
        qcResult: "Fail",
        reason: "Reason 2",
      },
      {
        batchId: "3",
        productName: "Product 3",
        expectedQuantity: 300,
        actualQuantity: 300,
        totalValue: 300,
        qcResult: "Pass",
        reason: "Reason 3",
      },
    ],
  };

  const storageLocationTableBox: TableBoxProps = {
    title: "Storage Location",
    headers: [
      "Batch ID",
      "Product Name",
      "Expected Quantity",
      "Actual Quantity",
      "Storage Location",
    ],
    data: [
      {
        batchId: "1",
        productName: "Product 1",
        expectedQuantity: 100,
        actualQuantity: 100,
        storageLocation: "Storage Location 1",
      },
      {
        batchId: "2",
        productName: "Product 2",
        expectedQuantity: 200,
        actualQuantity: 200,
        storageLocation: "Storage Location 2",
      },
      {
        batchId: "3",
        productName: "Product 3",
        expectedQuantity: 300,
        actualQuantity: 300,
        storageLocation: "Storage Location 3",
      },
    ],
  };

  const defectiveStorageLocationTableBox: TableBoxProps = {
    title: "Defective Storage Location",
    headers: [
      "Batch ID",
      "Product Name",
      "Expected Quantity",
      "Actual Quantity",
      "Storage Location",
    ],
    data: [
      {
        batchId: "1",
        productName: "Product 1",
        expectedQuantity: 100,
        actualQuantity: 100,
        storageLocation: "Storage Location 1",
      },
      {
        batchId: "2",
        productName: "Product 2",
        expectedQuantity: 200,
        actualQuantity: 200,
        storageLocation: "Storage Location 2",
      },
      {
        batchId: "3",
        productName: "Product 3",
        expectedQuantity: 300,
        actualQuantity: 300,
        storageLocation: "Storage Location 3",
      },
    ],
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Import Detail" />
      <div className="flex flex-col gap-6">
        <UtilityBar />
        <div className="flex justify-between gap-6">
          <div className="flex flex-3 flex-col gap-6">
            <GeneralInformation />
            <TableBox {...productTableBox} />
            <TableBox {...storageLocationTableBox} />
            <TableBox {...defectiveStorageLocationTableBox} />
          </div>
          <div className="flex-1">
            <ActivityLog />
          </div>
        </div>
      </div>
    </div>
  );
}
