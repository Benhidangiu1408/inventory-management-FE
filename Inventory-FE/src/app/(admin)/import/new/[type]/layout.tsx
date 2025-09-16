import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CustomTable from "@/components/TA_common/CustomTable";
import InfoBox from "@/components/TA_create_page/InfoBox";
import InfoPagination from "@/components/TA_create_page/InfoPagination";
import { Column, ProductTempRow } from "@/interfaces/interface.table";
import {
  faCircleInfo,
  faCube,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SmallInfoBox = ({
  title = "",
  warehouse = "",
  name = "",
  address = "",
  location = "",
  status = "",
}: {
  title: string;
  warehouse: string;
  name: string;
  address: string;
  location: string;
  status: string;
}) => {
  return (
    <div className="w-full rounded-2xl border border-gray-200">
      <div className="border-b border-gray-200 px-6 py-3 text-center font-bold uppercase">
        {title}
      </div>
      <ul className="p-6">
        <li>Warehouse: {warehouse}</li>
        <li>Name: {name}</li>
        <li>Address: {address}</li>
        <li>Location: {location}</li>
        <li>Status: {status}</li>
      </ul>
    </div>
  );
};

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
            <ul className="flex flex-col gap-3 p-6 text-base">
              <li>Name: ABCXYZ</li>
              <li>Email: abcxyz@gmail.com</li>
              <li>Address: 1234567890</li>
              <li>Phone: 0909090909</li>
              <li>Status: Active</li>
            </ul>
          ) : (
            <>
              <div className="">
                <div className="flex gap-5 p-6">
                  <SmallInfoBox
                    title="FROM"
                    warehouse="Warehouse 1"
                    name="Name 1"
                    address="Address 1"
                    location="Location 1"
                    status="Status 1"
                  />
                  <SmallInfoBox
                    title="TO"
                    warehouse="Warehouse 2"
                    name="Name 2"
                    address="Address 2"
                    location="Location 2"
                    status="Status 2"
                  />
                </div>
              </div>
            </>
          )}
        </InfoBox>

        <InfoBox icon={<FontAwesomeIcon icon={faCube} />} title="Product List">
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

        <InfoPagination totalPages={4} />
      </div>
    </div>
  );
}
