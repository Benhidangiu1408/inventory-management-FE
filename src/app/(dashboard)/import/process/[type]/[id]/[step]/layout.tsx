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
  faTruck,
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
import { ProductVariantProvider } from "@/context/ProductVariantContext";
import CancelSheetButton from "@/components/InboundOutboundClient/CancelSheetButton";
import { SheetStatus } from "@/interfaces/inventoryManagementType";
import { cookies } from "next/headers";
import { UserPermissions } from "@/interfaces/userManagementType";

export default async function ImportProcessLayout({
  params,
  children,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ type: string; id: string; step: string }>;
}>) {
  const { type, id, step } = await params;

  const cookieStore = await cookies();
  const hasStockInPermission = cookieStore
    .get("permissions")
    ?.value.includes(UserPermissions.STOCK_IN);

  const isProductMappingStep = step === "product-mapping";
  const progressStep =
    step === "product-mapping"
      ? "quantity-check"
      : (step as "quantity-check" | "quality-check" | "storage-location");

  const importSheetDetail =
    await inboundOutboundService.getImportSheetDetail(id);

  let qcSheetDetail = null;

  if (step !== "quantity-check") {
    qcSheetDetail = await inboundOutboundService.getQCSheetByImportSheetId(id);
  }

  const productVariants: ProductVariantResponse[] =
    await inboundOutboundService.getProductVariants();

  const title =
    type === "SUPPLIER".toLowerCase()
      ? "Supplier Information"
      : type === "INTERNAL".toLowerCase()
        ? "Transfer Information"
        : "Manufacturer Information";

  const description =
    type === "SUPPLIER".toLowerCase()
      ? "Supplier Description"
      : type === "INTERNAL".toLowerCase()
        ? "Transfer Information Description"
        : "Manufacturer Information Description";

  const icon =
    type === "SUPPLIER".toLowerCase()
      ? faDollarSign
      : type === "INTERNAL".toLowerCase()
        ? faCube
        : type === "EXTERNAL_SUPPLIER".toLowerCase()
          ? faTruck
          : faIndustry;

  return (
    <div>
      <PageBreadcrumb
        pageTitle="Import Process"
        filters={["process", type, id]}
        status={<InfoBoxStatus icon={icon} type={type.replace("_", " ")} />}
      />

      <div className="mb-6 flex items-center justify-between">
        <div className="">
          Sheet Status: <Badge>{importSheetDetail.status}</Badge>
        </div>
        {hasStockInPermission && (
          <CancelSheetButton
            disabled={importSheetDetail.status === SheetStatus.COMPLETED}
          />
        )}
      </div>

      <ImportProvider initialData={importSheetDetail}>
        <QualityCheckProvider initialData={qcSheetDetail}>
          <div className="flex flex-col gap-6">
            <InfoBox
              icon={<FontAwesomeIcon icon={faCircleInfo} />}
              title={title}
              description={description}
            >
              {type === "SUPPLIER".toLowerCase() ||
              type === "EXTERNAL_SUPPLIER".toLowerCase() ? (
                <InfoList>
                  <ul className="flex flex-col gap-3">
                    <li>
                      <span className="font-bold">Name:</span>{" "}
                      {importSheetDetail.supplier.name}
                    </li>
                    <li>
                      <span className="font-bold">Email:</span>{" "}
                      {importSheetDetail.supplier.email}
                    </li>
                    <li>
                      <span className="font-bold">Phone:</span>{" "}
                      {importSheetDetail.supplier.phone}
                    </li>
                    <li>
                      <span className="font-bold">Address:</span>{" "}
                      {importSheetDetail.supplier.address}
                    </li>
                  </ul>
                </InfoList>
              ) : (
                <>
                  <InfoList className="grid grid-cols-2 gap-6 p-6">
                    <SmallInfoBox
                      title="FROM"
                      data={{
                        warehouse:
                          importSheetDetail.sourceWarehouse?.id ?? "N/A",
                        name: importSheetDetail.sourceWarehouse?.name ?? "N/A",
                      }}
                    />
                    <SmallInfoBox
                      title="TO"
                      data={{
                        warehouse: importSheetDetail.warehouse?.id ?? "N/A",
                        name: importSheetDetail.warehouse?.name ?? "N/A",
                      }}
                    />
                  </InfoList>
                </>
              )}
            </InfoBox>

            {!isProductMappingStep && (
              <>
                <ProductListInfoBox
                  step={step}
                  productVariants={productVariants}
                />
              </>
            )}

            <ProgressBar step={progressStep} />

            {!isProductMappingStep ? (
              children
            ) : (
              <ProductVariantProvider initialData={productVariants}>
                {children}
              </ProductVariantProvider>
            )}

            <InfoPagination paginationType="process" />
          </div>
        </QualityCheckProvider>
      </ImportProvider>
    </div>
  );
}
