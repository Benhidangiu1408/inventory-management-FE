import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import GeneralInformation from "@/components/TA_common/GeneralInformation";
import OrderSummary from "@/components/TA_common/OrderSummary";
import TableBox from "@/components/TA_common/TableBox";
import InfoBox from "@/components/TA_create_page/InfoBox";
import InfoList from "@/components/TA_create_page/InfoList";
import Button from "@/components/ui/button/Button";
import {
  Column,
  ExportConfirmRow,
  TableProps,
} from "@/interfaces/interface.table";
import {
  faArrowRight,
  faCircleInfo,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ConfirmPage() {
  const columns: Column<ExportConfirmRow>[] = [
    {
      key: "batchId",
      header: "Batch ID",
    },
    {
      key: "productName",
      header: "Product Name",
    },
    {
      key: "currentStock",
      header: "Current Stock",
    },
    {
      key: "actualQuantity",
      header: "Actual Quantity",
    },
    {
      key: "location",
      header: "Location",
    },
    {
      key: "totalValue",
      header: "Total Value",
    },
    {
      key: "reason",
      header: "Reason",
    },
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
    columns,
    data,
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Export Process" />

      <div className="flex flex-col gap-6">
        <div className="flex items-center text-base text-gray-500">
          <FontAwesomeIcon icon={faDollarSign} />
          <h3>Export Process</h3>
        </div>

        <InfoBox
          icon={<FontAwesomeIcon icon={faCircleInfo} />}
          title={"Export Process"}
          description={"Export Process Description"}
        >
          <InfoList
            data={{
              name: "ABCXYZ",
              email: "abcxyz@gmail.com",
              address: "1234567890",
              phone: "0909090909",
              status: "Active",
            }}
          />
        </InfoBox>

        <div className="flex gap-6">
          <div className="flex flex-3 flex-col gap-6">
            <GeneralInformation />
            <TableBox title="Export Confirm" table={tableProps} />
          </div>
          <div className="flex flex-1 flex-col gap-6">
            <OrderSummary />
            <div className="rounded-2xl border border-gray-200 p-6">
              <h2 className="mb-4 text-lg">Confirmation</h2>
              <Button className="w-full" size="md">
                <FontAwesomeIcon icon={faArrowRight} /> Confirm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
