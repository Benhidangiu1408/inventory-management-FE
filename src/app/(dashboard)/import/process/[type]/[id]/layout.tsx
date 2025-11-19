import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import InfoBox from "@/default_components/TA_create_page/InfoBox";
import InfoList from "@/default_components/TA_create_page/InfoList";
import InfoPagination from "@/default_components/TA_create_page/InfoPagination";
import SmallInfoBox from "@/default_components/TA_create_page/SmallInfoBox";
import { ProcessProvider } from "@/context/ProcessContext";
import {
  faCircleInfo,
  faCube,
  faDollarSign,
  faIndustry,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProgressBar from "@/default_components/TA_create_page/ProgressBar";
import InfoBoxStatus from "@/default_components/TA_create_page/InfoBoxStatus";
import ProductListInfoBox from "@/default_components/TA_create_page/ProductListInfoBox";

export default async function ImportProcessLayout({
  params,
  children,
}: Readonly<{
  children: React.ReactNode;
  params: { type: string; id: string };
}>) {
  const { type, id } = await params;

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
    <ProcessProvider>
      <div>
        <PageBreadcrumb
          pageTitle="Import Process"
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

          <ProgressBar />

          {children}

          <InfoPagination paginationType="process" />
        </div>
      </div>
    </ProcessProvider>
  );
}
