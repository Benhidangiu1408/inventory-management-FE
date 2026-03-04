import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import InfoBox from "@/components/TA_create_page/InfoBox";
import InfoList from "@/components/TA_create_page/InfoList";
import InfoPagination from "@/components/TA_create_page/InfoPagination";
import SmallInfoBox from "@/components/TA_create_page/SmallInfoBox";
import {
  faCircleInfo,
  faCube,
  faDollarSign,
  faIndustry,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProgressBar from "@/components/TA_create_page/ProgressBar";
import InfoBoxStatus from "@/components/TA_create_page/InfoBoxStatus";
import ProductListInfoBox from "@/components/TA_create_page/ProductListInfoBox";
import { ProductVariantResponse } from "@/interfaces/inboundOutboundType";
import { inboundOutboundService } from "@/services/InboundOutboundService";
import { ImportProvider } from "@/context/ImportContext";
import Badge from "@/default_components/ui/badge/Badge";
import { QualityCheckProvider } from "@/context/QualityCheckContext";

export default async function ImportProcessLayout({
  params,
  children,
}: Readonly<{
  children: React.ReactNode;
  params: { type: string; id: string; step: string };
}>) {
  const { type, id, step } = await params;

  const importSheetDetail =
    await inboundOutboundService.getImportSheetDetail(id);

  let qcSheetDetail = null;

  if (step === "quality-check") {
    qcSheetDetail = await inboundOutboundService.getQCSheetByImportSheetId(id);
  }

  console.log(qcSheetDetail);

  const productVariants: ProductVariantResponse[] =
    await inboundOutboundService.getProductVariants();

  // const sampleData = {
  //   name: "ABCXYZ",
  //   email: "abcxyz@gmail.com",
  //   address: "1234567890",
  //   phone: "0909090909",
  //   status: "Active",
  // };

  const title =
    type === "SUPPLIER".toLowerCase()
      ? "Purchase Order"
      : type === "INTERNAL".toLowerCase()
        ? "Transfer Information"
        : "Manufacturer Information";

  const description =
    type === "SUPPLIER".toLowerCase()
      ? "Purchase Order Description"
      : type === "INTERNAL".toLowerCase()
        ? "Transfer Information Description"
        : "Manufacturer Information Description";

  const icon =
    type === "SUPPLIER".toLowerCase()
      ? faDollarSign
      : type === "INTERNAL".toLowerCase()
        ? faCube
        : faIndustry;

  return (
    <div>
      <PageBreadcrumb
        pageTitle="Import Process"
        filters={["process", type, id]}
        status={<InfoBoxStatus icon={icon} type={type} />}
      />

      <ImportProvider initialData={importSheetDetail}>
        <QualityCheckProvider initialData={qcSheetDetail}>
          <div className="flex flex-col gap-6">
            <InfoBox
              icon={<FontAwesomeIcon icon={faCircleInfo} />}
              title={title}
              description={description}
            >
              {type === "SUPPLIER" ? (
                <InfoList>
                  {/* {Object.entries(sampleData).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-bold capitalize">{key}</span>:{" "}
                      {value}
                    </div>
                  ))} */}
                  <div>
                    Status: <Badge>{importSheetDetail.status}</Badge>
                  </div>
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

            <ProductListInfoBox step={step} productVariants={productVariants} />

            <ProgressBar
              step={
                step as "quantity-check" | "quality-check" | "storage-location"
              }
            />

            {children}

            <InfoPagination paginationType="process" />
          </div>
        </QualityCheckProvider>
      </ImportProvider>
    </div>
  );
}
