/* eslint-disable @typescript-eslint/no-unused-vars */
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CustomTable from "@/components/TA_common/CustomTable";
import InfoBox from "@/components/TA_create_page/InfoBox";

import {
  Column,
  ProductTempRow,
  QuantityCheckRow,
} from "@/interfaces/interface.table";
import {
  faCheck,
  faCircleCheck,
  faCircleInfo,
  faCube,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "@/components/form/input/InputField";
import Pagination from "@/components/tables/Pagination";
import InfoPagination from "@/components/TA_create_page/InfoPagination";

export default function ImportProcessPage() {
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

  const quantityCheckColumn: Column<QuantityCheckRow>[] = [
    {
      key: "name",
      header: "Product Name",
    },
    {
      key: "expectedQuantity",
      header: "Expected Quantity",
    },
    {
      key: "actualQuantity",
      header: "Actual Quantity",
      render: (
        value: QuantityCheckRow[keyof QuantityCheckRow],
        row: QuantityCheckRow,
      ) => {
        return <Input />;
      },
    },
    {
      key: "variance",
      header: "Variance",
    },
    {
      key: "reason",
      header: "Reason",
      render: (
        value: QuantityCheckRow[keyof QuantityCheckRow],
        row: QuantityCheckRow,
      ) => {
        return <Input />;
      },
    },
  ];

  const quantityCheckData: QuantityCheckRow[] = [
    {
      name: "Product 1",
      expectedQuantity: 10,
      actualQuantity: 10,
      variance: 0,
      reason: "Reason 1",
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
          title="Purchase Order"
          description="Purchase Order Description"
          content={
            <ul className="flex flex-col gap-3 p-6 text-base">
              <li>Name: ABCXYZ</li>
              <li>Email: abcxyz@gmail.com</li>
              <li>Address: 1234567890</li>
              <li>Phone: 0909090909</li>
              <li>Status: Active</li>
            </ul>
          }
        />

        <InfoBox
          icon={<FontAwesomeIcon icon={faCube} />}
          title="Product List"
          content={
            <div className="p-6">
              <CustomTable<ProductTempRow>
                columns={productTempColumn}
                data={productTempData}
              />
            </div>
          }
        />

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

        <InfoBox
          icon={<FontAwesomeIcon icon={faCircleCheck} />}
          title="Quantity Check"
          content={
            <div className="p-6">
              <CustomTable<QuantityCheckRow>
                columns={quantityCheckColumn}
                data={quantityCheckData}
              />
            </div>
          }
        />

        <InfoPagination />
      </div>
    </div>
  );
}
