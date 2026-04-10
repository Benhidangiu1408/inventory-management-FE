import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import InfoBox from "@/components/TA_create_page/InfoBox";
import InfoList from "@/components/TA_create_page/InfoList";
import SmallInfoBox from "@/components/TA_create_page/SmallInfoBox";
import ExportProcessPagination from "@/components/TA_common/ExportProcessPagination";
import {
  faCircleInfo,
  faCube,
  faIndustry,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InfoBoxStatus from "@/components/TA_create_page/InfoBoxStatus";
import ExportProductListInfoBox from "@/components/TA_create_page/ExportProductListInfoBox";
import { inboundOutboundService } from "@/services/InboundOutboundService";
import { ExportProvider } from "@/context/ExportContext";
import Badge from "@/default_components/ui/badge/Badge";
import CancelSheetButton from "@/components/InboundOutboundClient/CancelSheetButton";
import { SheetStatus } from "@/interfaces/inventoryManagementType";
import { UserPermissions } from "@/interfaces/userManagementType";
import { cookies } from "next/headers";

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

  const cookieStore = await cookies();
  const permissions = cookieStore.get("permissions")?.value;
  const hasStockOutPermission = permissions?.includes(
    UserPermissions.STOCK_OUT,
  );

  const title =
    type === "customer"
      ? "Customer Information"
      : type === "internal"
        ? "Internal Transfer Information"
        : "Manufacturer Information";

  const description =
    type === "customer"
      ? "Customer Information Description"
      : type === "internal"
        ? "Internal Transfer Information Description"
        : "Manufacturer Information Description";

  const icon =
    type === "customer" ? faUser : type === "internal" ? faCube : faIndustry;

  // Trang confirm không dùng layout chung (breadcrumb, InfoBox, progress, pagination)
  if (step === "confirm") {
    return (
      <ExportProvider initialData={exportSheetDetail}>
        <PageBreadcrumb
          pageTitle="Export Process"
          filters={["process", type, id]}
          status={<InfoBoxStatus icon={icon} type={type} />}
        />
        <div className="mb-6">
          Sheet Status: <Badge>{exportSheetDetail.status}</Badge>
        </div>
        {children}
        <ExportProcessPagination />
      </ExportProvider>
    );
  }

  return (
    <div>
      <PageBreadcrumb
        pageTitle="Export Process"
        filters={["process", type, id]}
        status={<InfoBoxStatus icon={icon} type={type} />}
      />

      <div className="mb-6 flex items-center justify-between">
        <div>
          Sheet Status: <Badge>{exportSheetDetail.status}</Badge>
        </div>
        {hasStockOutPermission && (
          <CancelSheetButton
            type="export"
            disabled={exportSheetDetail.status !== SheetStatus.CREATED}
          />
        )}
      </div>

      <ExportProvider initialData={exportSheetDetail}>
        <div className="flex flex-col gap-6">
          <InfoBox
            icon={<FontAwesomeIcon icon={faCircleInfo} />}
            title={title}
            description={description}
          >
            {type === "customer" || "CUSTOMER" ? (
              <InfoList>
                <ul className="flex flex-col gap-4">
                  <li>
                    <span className="mr-1 font-bold">Status:</span>
                    <Badge>{exportSheetDetail.customer.status}</Badge>
                  </li>
                  <li>
                    <span className="font-bold">Name:</span>{" "}
                    {exportSheetDetail.customer.name}
                  </li>
                  <li>
                    <span className="font-bold">Address:</span>{" "}
                    {exportSheetDetail.customer.address}
                  </li>
                  <li>
                    <span className="font-bold">Email:</span>{" "}
                    {exportSheetDetail.customer.email}
                  </li>
                  <li>
                    <span className="font-bold">Phone Number:</span>{" "}
                    {exportSheetDetail.customer.phoneNumber}
                  </li>
                </ul>
              </InfoList>
            ) : (
              <>
                <InfoList className="grid grid-cols-2 gap-6 p-6">
                  <SmallInfoBox
                    title="FROM"
                    data={{
                      warehouse: exportSheetDetail.warehouse.id,
                      name: exportSheetDetail.warehouse.name,
                    }}
                  />
                  <SmallInfoBox
                    title="TO"
                    data={{
                      warehouse: exportSheetDetail.destinationWarehouse.id,
                      name: exportSheetDetail.destinationWarehouse.name,
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

          {children}

          <ExportProcessPagination />
        </div>
      </ExportProvider>
    </div>
  );
}
