"use client";

import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InfoBox from "./InfoBox";
import { faCube, faPlus } from "@fortawesome/free-solid-svg-icons";
import CustomContentModalBox from "../modal/CustomContentModalBox";
import CreateModal from "./CreateModal";
import { ProductTempRow } from "../../interfaces/interface.table";
import CustomizableTable, { Column } from "../table/CustomizableTable";

export default function ProductListInfoBox({ step = "" }: { step?: string }) {
  const [productTempData, setProductTempData] = useState<ProductTempRow[]>([
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
  ]);

  const getSelectedProductsRef = useRef<(() => ProductTempRow[]) | null>(null);

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

  const handleSave = () => {
    if (getSelectedProductsRef.current) {
      const selectedProducts = getSelectedProductsRef.current();
      console.log("Selected products:", selectedProducts);

      if (selectedProducts.length > 0) {
        setProductTempData((prev) => {
          // Xử lý trùng tên: nếu trùng thì cộng dồn quantity, nếu không thì thêm mới
          const updated = [...prev];
          selectedProducts.forEach((newProduct) => {
            const existingIndex = updated.findIndex(
              (item) => item.name === newProduct.name,
            );
            if (existingIndex >= 0) {
              // Nếu trùng tên, cộng dồn quantity
              updated[existingIndex] = {
                ...updated[existingIndex],
                expectedQuantity:
                  updated[existingIndex].expectedQuantity +
                  newProduct.expectedQuantity,
              };
            } else {
              // Nếu không trùng, thêm mới
              updated.push(newProduct);
            }
          });
          return updated;
        });
      } else {
        console.warn(
          "No products selected or all products have invalid pickQuantity",
        );
      }
    } else {
      console.error("getSelectedProductsRef.current is null");
    }
  };

  return (
    <InfoBox
      icon={<FontAwesomeIcon icon={faCube} />}
      title="Product List"
      modal={
        <CustomContentModalBox
          step={step}
          startIcon={<FontAwesomeIcon icon={faPlus} />}
          width={"max-w-[1200px]"}
          btnName="Add"
          onSave={handleSave}
          modalContent={
            <CreateModal getSelectedProductsRef={getSelectedProductsRef} />
          }
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
