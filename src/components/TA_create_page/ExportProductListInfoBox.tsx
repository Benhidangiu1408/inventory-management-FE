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
  ExportSheetDetailCreateReq,
  ExportSheetDetailUpdateReq,
  ProductVariantResponse,
} from "@/interfaces/inboundOutboundType";
import { useExport } from "@/context/ExportContext";
import toast from "react-hot-toast";
import { SheetStatus } from "@/interfaces/inventoryManagementType";
import { useParams } from "next/navigation";
import {
  createExportSheetDetail,
  updateExportSheetDetail,
} from "@/actions/inbound-outbound";

export default function ExportProductListInfoBox({
  step = "",
  productVariants,
}: {
  step?: string;
  productVariants: ProductVariantResponse[];
}) {
  const { id } = useParams();

  const { exportData, setExportData } = useExport();

  const productTempData: ProductTempRow[] = exportData.details.map(
    (detail) => ({
      id: detail.productVariant.id,
      name: detail.productVariant.product.name,
      description: detail.productVariant.description,
      expectedQuantity: detail.expectedQuantity ?? 0,
      unit: detail.productVariant.product.baseUnit,
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
      const existingItem = productTempData.find(
        (product) => product.id === selectedProduct.id,
      );
      const productVariant = productVariants.find(
        (pv) => pv.id === selectedProduct.id,
      );
      if (!productVariant) {
        toast.error("Product variant not found");
        return;
      }

      const data: ExportSheetDetailCreateReq = {
        productVariantId: selectedProduct.id,
        expectedQuantity: selectedProduct.expectedQuantity,
        unitId: selectedProduct.unit.id,
      };

      if (!existingItem) {
        const res = await createExportSheetDetail(id as string, data);

        setExportData((prev) => ({
          ...prev,
          details: [...prev.details, res],
        }));
        toast.success("Added product to export list");
      } else {
        const updatedQuantity =
          existingItem.expectedQuantity + selectedProduct.expectedQuantity;
        const foundDetail = exportData.details.find(
          (detail) => detail.productVariant.id === selectedProduct.id,
        );
        if (!foundDetail) return;

        const data: ExportSheetDetailUpdateReq = {
          expectedQuantity: updatedQuantity,
        };

        const res = await updateExportSheetDetail(
          id as string,
          foundDetail.id,
          data,
        );

        console.log(res);

        setExportData((prev) => ({
          ...prev,
          details: prev.details.map((detail) =>
            detail.id === res.id ? res : detail,
          ),
        }));
        toast.success("Updated quantity in export list");
      }
    } else {
      toast.error("You have to checkbox and input the pick quantity");
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
            exportData.status === SheetStatus.CREATED
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
