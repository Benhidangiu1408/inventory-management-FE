"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InfoBox from "./InfoBox";
import { faCube, faPlus } from "@fortawesome/free-solid-svg-icons";
import CustomContentModalBox from "../../components/modal/CustomContentModalBox";
import CreateModal from "./CreateModal";
import { ProductTempRow } from "../../interfaces/interface.table";
import CustomizableTable, {
  Column,
} from "../../components/table/CustomizableTable";

export default function ProductListInfoBox() {
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
    <InfoBox
      icon={<FontAwesomeIcon icon={faCube} />}
      title="Product List"
      modal={
        <CustomContentModalBox
          startIcon={<FontAwesomeIcon icon={faPlus} />}
          width={"max-w-[1200px]"}
          openBtnTitle="Add"
          onSave={() => {
            console.log("test");
          }}
          modalContent={<CreateModal />}
        />
      }
    >
      <div className="p-6">
        <CustomizableTable<ProductTempRow>
          headers={productTempColumn}
          data={productTempData}
        />
      </div>
    </InfoBox>
  );
}
