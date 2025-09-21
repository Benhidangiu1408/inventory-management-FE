import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import OrderSummary from "@/components/TA_common/OrderSummary";
import TableBox from "@/components/TA_common/TableBox";
import InfoBox from "@/components/TA_create_page/InfoBox";
import InfoList from "@/components/TA_create_page/InfoList";
import Button from "@/components/ui/button/Button";
import { ExportConfirmRow } from "@/interfaces/interface.table";
import {
  Column,
  TableProps,
} from "@/components/Ky_components/CustomizableTable";
import {
  faArrowRight,
  faCircleInfo,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GeneralInfoSection from "@/components/Ky_components/GeneralInformation";

export default async function ConfirmPage({
  params,
}: {
  params: { type: string; id: string };
}) {
  const { type, id } = await params;

  const columns: Column<ExportConfirmRow>[] = [
    {
      key: "batchId",
      label: "Batch ID",
    },
    {
      key: "productName",
      label: "Product Name",
    },
    {
      key: "currentStock",
      label: "Current Stock",
    },
    {
      key: "actualQuantity",
      label: "Actual Quantity",
    },
    {
      key: "location",
      label: "Location",
    },
    {
      key: "totalValue",
      label: "Total Value",
    },
    {
      key: "reason",
      label: "Reason",
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
    headers: columns,
    data,
  };

  return (
    <>
      <PageBreadcrumb
        pageTitle="Export Process"
        filters={["process", type, id]}
      />

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
            <GeneralInfoSection
              items={[
                {
                  label: "Stock-out Code",
                  value: "SO-2025-001",
                },
                {
                  label: "Stock-out Date",
                  value: "2025-01-01",
                },
                {
                  label: "Stock-out By",
                  value: "John Doe",
                },
                {
                  label: "Customer",
                  value: "Customer 1",
                },
              ]}
            />
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
