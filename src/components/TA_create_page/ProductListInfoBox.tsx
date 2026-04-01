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
import { useParams } from "next/navigation";
import { useImport } from "@/context/ImportContext";
import toast from "react-hot-toast";
import { SheetStatus } from "@/interfaces/inventoryManagementType";
import {
  createImportSheetDetail,
  updateImportSheetDetail,
} from "@/actions/inbound-outbound";
import { ApiError } from "next/dist/server/api-utils";

export default function ProductListInfoBox({
  step = "",
  productVariants,
}: {
  step?: string;
  productVariants: ProductVariantResponse[];
}) {
  const params = useParams();

  const { id } = params;

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

  const [selectedProducts, setSelectedProducts] = useState<ProductTempRow[]>(
    [],
  );
  const [hasInvalidSelection, setHasInvalidSelection] = useState(false);

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
    if (hasInvalidSelection) {
      toast.error("Some selected products are missing a valid pick quantity");
      return;
    }

    if (selectedProducts.length === 0) {
      toast.error("You have to checkbox and input the pick quantity");
      return;
    }

    let results;
    try {
      results = await Promise.all(
        selectedProducts.map(async (selectedProduct) => {
          const item = productTempData.find(
            (product) => product.id === selectedProduct.id,
          );

          if (!item) {
            const data: ImportSheetDetailCreateReq = {
              productVariantId: selectedProduct.id,
              expectedQuantity: selectedProduct.expectedQuantity,
              unitId: selectedProduct.unit.id,
            };
            const res = await createImportSheetDetail(id as string, data);
            return { type: "create" as const, res };
          } else {
            const foundedDetail = details.find(
              (detail) => detail.productVariant.id === selectedProduct.id,
            );

            if (!foundedDetail) {
              toast.error(
                "Not found correct Detail for + " + selectedProduct.id,
              );
              return null;
            }

            if (foundedDetail.unit?.id !== selectedProduct.unit.id) {
              throw new Error(
                `The unit ${selectedProduct.unit.name} is not equal to ${foundedDetail.unit?.name} to update Product Variant ${selectedProduct.id}`,
              );
            }

            const data: ImportSheetDetailUpdateReq = {
              productVariantId: selectedProduct.id,
              expectedQuantity:
                item.expectedQuantity + selectedProduct.expectedQuantity,
              unitId: selectedProduct.unit.id,
            };

            const res = await updateImportSheetDetail(
              id as string,
              foundedDetail.id,
              data,
            );
            return { type: "update" as const, res };
          }
        }),
      );
    } catch (error) {
      const message =
        error instanceof Error || error instanceof ApiError
          ? error.message
          : "Failed to save products. Please try again.";
      toast.error(message);
      return;
    }

    setImportData((prev) => {
      let updatedDetails = [...prev.details];
      for (const result of results) {
        if (!result) continue;
        if (result.type === "create") {
          updatedDetails = [...updatedDetails, result.res];
        } else {
          updatedDetails = updatedDetails.map((detail) =>
            detail.id === result.res.id ? result.res : detail,
          );
        }
      }
      return { ...prev, details: updatedDetails };
    });
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
              onSelectedProductsChange={setSelectedProducts}
              onHasInvalidChange={setHasInvalidSelection}
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
