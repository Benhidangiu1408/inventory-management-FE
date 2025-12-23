import CustomizableTable, {
  Column,
} from "@/components/table/CustomizableTable";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import InfoBox from "@/components/TA_create_page/InfoBox";
import InfoBoxStatus from "@/components/TA_create_page/InfoBoxStatus";
import InfoList from "@/components/TA_create_page/InfoList";
import ProductListInfoBox from "@/components/TA_create_page/ProductListInfoBox";
// import ProgressBar from "@/default_components/TA_create_page/ProgressBar";
import SmallInfoBox from "@/components/TA_create_page/SmallInfoBox";
import { ExportQuantityCheckRow } from "@/interfaces/interface.table";
import Button from "@/default_components/ui/button/Button";
import Link from "next/link";

import {
  faCircleCheck,
  faCircleInfo,
  faCube,
  faDollarSign,
  faIndustry,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default async function ExportQuantityCheckPage({
  params,
}: {
  params: { type: string; id: string };
}) {
  const { type, id } = await params;

  const exportQuantityCheckColumn: Column<ExportQuantityCheckRow>[] = [
    {
      key: "quantity",
      label: "Quantity",
    },
    {
      key: "location",
      label: "Location",
    },
  ];

  const exportQuantityCheckData: ExportQuantityCheckRow[] = [
    {
      quantity: 10,
      location: "Warehouse B/ Shelf A",
    },
    {
      quantity: 10,
      location: "Warehouse C/ Shelf D",
    },
    {
      quantity: 30,
      location: "Warehouse F/ Shelf H",
    },
  ];

  const sampleData = {
    name: "ABCXYZ",
    email: "abcxyz@gmail.com",
    address: "1234567890",
    phone: "0909090909",
    status: "Active",
  };

  const title =
    type === "purchase-order"
      ? "Purchase Order"
      : type === "transfer"
        ? "Transfer Information"
        : "Manufacturer Information";

  const description =
    type === "purchase-order"
      ? "Purchase Order Description"
      : type === "transfer"
        ? "Transfer Information Description"
        : "Manufacturer Information Description";

  const icon =
    type === "purchase-order"
      ? faDollarSign
      : type === "transfer"
        ? faCube
        : faIndustry;

  return (
    <div>
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
          {type === "purchase-order" ? (
            <InfoList>
              {Object.entries(sampleData).map(([key, value]) => (
                <div key={key}>
                  <span className="font-bold capitalize">{key}</span>: {value}
                </div>
              ))}
            </InfoList>
          ) : (
            <>
              <InfoList className="grid grid-cols-2 gap-6 p-6">
                <SmallInfoBox
                  title="FROM"
                  data={{
                    warehouse: "Warehouse 1",
                    name: "Name 1",
                    address: "Address 1",
                    location: "Location 1",
                    status: "Status 1",
                  }}
                />
                <SmallInfoBox
                  title="TO"
                  data={{
                    warehouse: "Warehouse 2",
                    name: "Name 2",
                    address: "Address 2",
                    location: "Location 2",
                    status: "Status 2",
                  }}
                />
              </InfoList>
            </>
          )}
        </InfoBox>

        <ProductListInfoBox />

        <InfoBox
          icon={<FontAwesomeIcon icon={faCircleCheck} />}
          title="Quantity Check"
        >
          <div className="flex flex-col gap-4 p-6">
            <div className="flex flex-col gap-1">
              <h2>Office Chair Black</h2>
              <div>SKU: SPYBX-DRINK-500ML-LEM-01</div>
              <div>Expected Quantity: 50</div>
              <div className="text-brand-500 font-bold">Total Quantity: 50</div>
            </div>
            <CustomizableTable<ExportQuantityCheckRow>
              headers={exportQuantityCheckColumn}
              data={exportQuantityCheckData}
            />
          </div>
        </InfoBox>

        <div className="flex justify-end">
          <Link href={`/export/process/${type}/${id}/confirm`}>
            <Button size="md" endIcon={<FontAwesomeIcon icon={faArrowRight} />}>
              Continue
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
