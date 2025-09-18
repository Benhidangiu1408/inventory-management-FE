import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CustomTable from "@/components/TA_common/CustomTable";
import InfoBox from "@/components/TA_create_page/InfoBox";
import InfoList from "@/components/TA_create_page/InfoList";
import InfoPagination from "@/components/TA_create_page/InfoPagination";
import SmallInfoBox from "@/components/TA_create_page/SmallInfoBox";
import { ProcessProvider } from "@/context/ProcessContext";
import { Column, ProductTempRow } from "@/interfaces/interface.table";
import {
  faCircleInfo,
  faCube,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default async function ImportProcessLayout({
  params,
  children,
}: Readonly<{
  children: React.ReactNode;
  params: { type: string };
}>) {
  const { type } = await params;

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

  const productTempColumn: Column<ProductTempRow>[] = [
    {
      key: "name",
      header: "Product Name",
    },
    {
      key: "expectedQuantity",
      header: "Expected Quantity",
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
        <PageBreadcrumb pageTitle="Import Process" />

        <div className="flex flex-col gap-6">
          <div className="flex items-center text-base text-gray-500">
            <FontAwesomeIcon icon={faDollarSign} />
            <h3>Purchase Order</h3>
          </div>

          <InfoBox
            icon={<FontAwesomeIcon icon={faCircleInfo} />}
            title={title}
            description={description}
          >
            {type === "purchase-order" ? (
              <InfoList
                data={{
                  name: "ABCXYZ",
                  email: "abcxyz@gmail.com",
                  address: "1234567890",
                  phone: "0909090909",
                  status: "Active",
                }}
              />
            ) : (
              <>
                <div className="">
                  <div className="flex gap-5 p-6">
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
                  </div>
                </div>
              </>
            )}
          </InfoBox>

          <InfoBox
            icon={<FontAwesomeIcon icon={faCube} />}
            title="Product List"
          >
            <div className="p-6">
              <CustomTable<ProductTempRow>
                columns={productTempColumn}
                data={productTempData}
              />
            </div>
          </InfoBox>

          <div className="flex gap-6 rounded-2xl border border-gray-200 px-6 py-5">
            <div className="bg-brand-500 flex-1 rounded-2xl py-2 text-center text-base text-white">
              Quantity Check
            </div>
            <div className="flex-1 rounded-2xl bg-gray-500 py-2 text-center text-base text-white">
              Quality Check
            </div>
            <div className="flex-1 rounded-2xl bg-gray-500 py-2 text-center text-base text-white">
              Storage Location
            </div>
          </div>

          {children}

          <InfoPagination paginationType="process" />
        </div>
      </div>
    </ProcessProvider>
  );
}
