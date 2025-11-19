import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import OrderSummary from "@/default_components/TA_common/OrderSummary";
import TableBox from "@/default_components/TA_common/TableBox";
import InfoBox from "@/default_components/TA_create_page/InfoBox";
import InfoList from "@/default_components/TA_create_page/InfoList";
import Button from "@/default_components/ui/button/Button";
import { ExportConfirmRow } from "@/interfaces/interface.table";
import { Column, TableProps } from "@/components/table/CustomizableTable";
import {
  faArrowRight,
  faCircleInfo,
  faIndustry,
  faRightLeft,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GeneralInfoSection from "@/default_components/Ky_components/GeneralInformation";
import InfoBoxStatus from "@/default_components/TA_create_page/InfoBoxStatus";

export default async function ConfirmPage({
  params,
}: {
  params: { type: string; id: string };
}) {
  const { type, id } = await params;

  const sampleData = {
    name: "ABCXYZ",
    email: "abcxyz@gmail.com",
    address: "1234567890",
    phone: "0909090909",
    status: "Active",
  };

  const title =
    type === "manufacturer"
      ? "Manufacturer Information"
      : type === "transfer"
        ? "Transfer Information"
        : "Customer Information";

  const description =
    type === "manufacturer"
      ? "Manufacturer Information Description"
      : type === "transfer"
        ? "Transfer Information Description"
        : "Customer Information Description";

  const icon =
    type === "manufacturer"
      ? faIndustry
      : type === "transfer"
        ? faRightLeft
        : faUser;

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
        status={<InfoBoxStatus icon={icon} type={type} />}
      />

      <div className="flex flex-col gap-6">
        <InfoBox
          icon={<FontAwesomeIcon icon={faCircleInfo} />}
          title={title}
          description={description}
        >
          <InfoList>
            {Object.entries(sampleData).map(([key, value]) => (
              <div key={key}>
                <span className="font-bold capitalize">{key}</span>: {value}
              </div>
            ))}
          </InfoList>
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
