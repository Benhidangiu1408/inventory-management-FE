"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InfoBox from "./InfoBox";
import { faCube, faPlus } from "@fortawesome/free-solid-svg-icons";
import CustomContentModalBox from "../modal/CustomContentModalBox";
import CreateModal from "./CreateModal";
import { ProductTempRow } from "../../interfaces/interface.table";
import CustomizableTable, { Column } from "../table/CustomizableTable";
import {
  ImportSheetDetailCreateReq,
  ImportSheetDetailUpdateReq,
  ImportSheetType,
  ProductVariantResponse,
} from "@/interfaces/inboundOutboundType";
import { inboundOutboundService } from "@/services/InboundOutboundService";
import { useParams } from "next/navigation";
import { useImport } from "@/context/ImportContext";
import toast from "react-hot-toast";
import { SheetStatus } from "@/interfaces/inventoryManagementType";
import {
  createImportSheetDetail,
  updateImportSheetDetail,
} from "@/actions/inbound-outbound";

export default function ProductListInfoBox({
  step = "",
  productVariants,
}: {
  step?: string;
  productVariants: ProductVariantResponse[];
}) {
  const params = useParams();

  const { type, id } = params;

  const { importData, setImportData } = useImport();

  const details = importData.details;

  const productTempData: ProductTempRow[] = importData.details.map(
    (detail) => ({
      id: detail.productVariant.id,
      name: detail.productVariant.product.name,
      description: detail.productVariant.description,
      expectedQuantity: detail.expectedQuantity ?? 0,
      unit: detail.unit ?? detail.productVariant.product.baseUnit,
    }),
  );

  const [selectedProduct, setSelectedProduct] = useState<ProductTempRow | null>(
    null,
  );

  const productTempColumn: Column<ProductTempRow>[] = [
    {
      key: "name",
      label: "Product Name",
    },
    {
      key: "description",
      label: "Description",
    },
    {
      key: "expectedQuantity",
      label: "Expected Quantity",
    },
    {
      key: "unit",
      label: "Unit",
      render: (_, row) => row.unit.name,
    },
  ];

  const handleSave = async () => {
    if (selectedProduct) {
      const item = productTempData.find(
        (product) => product.id === selectedProduct.id,
      );
      console.log("Selected product:", selectedProduct);

      const data: ImportSheetDetailCreateReq = {
        productVariantId: selectedProduct.id,
        expectedQuantity: selectedProduct.expectedQuantity,
        unitId: selectedProduct.unit.id,
      };

      if (!item) {
        const res = await createImportSheetDetail(id as string, data);

        setImportData((prev) => ({
          ...prev,
          details: [...prev.details, res],
        }));
      } else {
        const updatedQuantity =
          item.expectedQuantity + selectedProduct.expectedQuantity;

        const foundedDetail = details.find((detail) => {
          if (detail.productVariant.id === selectedProduct.id) {
            return detail;
          }
        });

        if (!foundedDetail) {
          console.log("Not found correct Detail");
          return;
        }

        const data: ImportSheetDetailUpdateReq = {
          productVariantId: selectedProduct.id,
          expectedQuantity: updatedQuantity,
        };

        const res = await updateImportSheetDetail(
          id as string,
          foundedDetail?.id,
          data,
        );

        setImportData((prev) => ({
          ...prev,
          details: prev.details.map((detail) =>
            detail.id === res.id ? res : detail,
          ),
        }));
      }
    } else {
      toast.error("You have to checkbox and input the pick quantity");
      console.warn(
        "No product selected or selected product has invalid pickQuantity",
      );
    }
  };

  return (
    <InfoBox
      icon={<FontAwesomeIcon icon={faCube} />}
      title="Product List"
      modal={
        <CustomContentModalBox
          step={step}
          showAddButton={
            step === "quantity-check" &&
            importData.status === SheetStatus.CREATED &&
            importData.type !== ImportSheetType.EXTERNAL_SUPPLIER &&
            importData.type !== ImportSheetType.INTERNAL
          }
          startIcon={<FontAwesomeIcon icon={faPlus} />}
          width={"max-w-[1200px]"}
          btnName="Add"
          onSave={handleSave}
          modalContent={
            <CreateModal
              productVariants={productVariants}
              onSelectedProductsChange={setSelectedProduct}
            />
          }
        />
      }
    >
      <div className="p-6">
        <CustomizableTable<ProductTempRow>
          headers={productTempColumn}
          data={productTempData}
          getRowId={(params) => String(params.data.id)}
        />
      </div>
    </InfoBox>
  );
}
