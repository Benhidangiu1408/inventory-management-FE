import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InfoBox from "@/components/TA_create_page/InfoBox";
import InfoList from "@/components/TA_create_page/InfoList";
import InfoPagination from "@/components/TA_create_page/InfoPagination";
import SmallInfoBox from "@/components/TA_create_page/SmallInfoBox";
import { ProcessProvider } from "@/context/ProcessContext";
import { ProductTempRow } from "@/interfaces/interface.table";
import CustomizableTable, {
  Column,
} from "@/components/Ky_components/CustomizableTable";
import {
  faCircleInfo,
  faCube,
  faDollarSign,
  faIndustry,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProgressBar from "@/components/TA_create_page/ProgressBar";
import InfoBoxStatus from "@/components/TA_create_page/InfoBoxStatus";

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

  const productTempColumn: Column<ProductTempRow>[] = [
    {
      key: "name",
      label: "Product Name",
    },
    {
      key: "expectedQuantity",
      label: "Expected Quantity",
    },
  ];

  const productTempData: ProductTempRow[] = [
    {
      name: "Product 1",
      expectedQuantity: 10,
    },
    {
      name: "Product 2",
      expectedQuantity: 20,
    },
    {
      name: "Product 3",
      expectedQuantity: 30,
    },
    {
      name: "Product 4",
      expectedQuantity: 40,
    },
    {
      name: "Product 5",
      expectedQuantity: 50,
    },
  ];

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

          <InfoBox
            icon={<FontAwesomeIcon icon={faCube} />}
            title="Product List"
          >
            <div className="p-6">
              <CustomizableTable<ProductTempRow>
                headers={productTempColumn}
                data={productTempData}
              />
            </div>
          </InfoBox>

          <ProgressBar />

          {children}

          <InfoPagination paginationType="process" />
        </div>
      </div>
    </ProcessProvider>
  );
}
