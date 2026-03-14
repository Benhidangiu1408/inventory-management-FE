import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import InfoBox from "@/components/TA_create_page/InfoBox";
import InfoList from "@/components/TA_create_page/InfoList";
import SmallInfoBox from "@/components/TA_create_page/SmallInfoBox";
import ExportProcessPagination from "@/components/TA_common/ExportProcessPagination";
import {
  faCircleInfo,
  faCube,
  faDollarSign,
  faIndustry,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExportProgressBar from "@/components/TA_create_page/ExportProgressBar";
import InfoBoxStatus from "@/components/TA_create_page/InfoBoxStatus";
import ExportProductListInfoBox from "@/components/TA_create_page/ExportProductListInfoBox";
import { ImportSheetResponse } from "@/interfaces/inboundOutboundType";
import { inboundOutboundService } from "@/services/InboundOutboundService";
import { ExportProvider } from "@/context/ExportContext";
import Badge from "@/default_components/ui/badge/Badge";
import { SheetStatus } from "@/interfaces/inventoryManagementType";
import { ImportSheetType } from "@/interfaces/inboundOutboundType";

// function createMockExportSheetDetail(
//   id: string,
//   productVariants: {
//     id: number;
//     description: string;
//     product: { id: number; name: string; code: string };
//   }[],
// ): ImportSheetResponse {
//   const details = productVariants.slice(0, 3).map((pv, index) => ({
//     id: index + 1,
//     description: pv.description,
//     productVariant: pv,
//     expectedQuantity: 10 + index * 5,
//     actualQuantity: undefined,
//     reason: undefined,
//   }));
//   return {
//     id: Number(id),
//     status: SheetStatus.CREATED,
//     type: ImportSheetType.SUPPLIER,
//     details,
//     createdAt: new Date().toISOString(),
//     warehouse: { id: 1, name: "Warehouse 1" },
//   };
// }

export default async function ExportProcessLayout({
  params,
  children,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ type: string; id: string; step: string }>;
}>) {
  const { type, id, step } = await params;

  const productVariants = await inboundOutboundService.getProductVariants();
  const exportSheetDetail = await inboundOutboundService.getExportSheetById(id);

  // const exportSheetDetail = createMockExportSheetDetail(id, productVariants);

  const title =
    type === "purchase-order"
      ? "Purchase Order"
      : type === "transfer"
        ? "Transfer Information"
        : type === "customer"
          ? "Customer Information"
          : "Manufacturer Information";

  const description =
    type === "purchase-order"
      ? "Purchase Order Description"
      : type === "transfer"
        ? "Transfer Information Description"
        : type === "customer"
          ? "Customer Information Description"
          : "Manufacturer Information Description";

  const icon =
    type === "purchase-order"
      ? faDollarSign
      : type === "transfer"
        ? faCube
        : type === "customer"
          ? faUser
          : faIndustry;

  return (
    <div>
      <PageBreadcrumb
        pageTitle="Export Process"
        filters={["process", type, id]}
        status={<InfoBoxStatus icon={icon} type={type} />}
      />

      <ExportProvider initialData={exportSheetDetail}>
        <div className="flex flex-col gap-6">
          <InfoBox
            icon={<FontAwesomeIcon icon={faCircleInfo} />}
            title={title}
            description={description}
          >
            {type === "purchase-order" ? (
              <InfoList>
                <div>
                  Status: <Badge>{exportSheetDetail.status}</Badge>
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

          <ExportProductListInfoBox
            step={step}
            productVariants={productVariants}
          />

          <ExportProgressBar step={step as "quantity-check" | "confirm"} />

          {children}

          <ExportProcessPagination />
        </div>
      </ExportProvider>
    </div>
  );
}
