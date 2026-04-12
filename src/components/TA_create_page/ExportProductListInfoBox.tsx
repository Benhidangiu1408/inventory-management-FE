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
  deleteExportSheetDetail,
  updateExportSheetDetail,
} from "@/actions/inbound-outbound";
import { ApiError } from "next/dist/server/api-utils";
import { useAuth } from "@/context/AuthContext";
import { UserPermissions } from "@/interfaces/userManagementType";
import Button from "@/default_components/ui/button/Button";
import { Trash } from "lucide-react";
import { useConfirmModal } from "@/hooks/useConfirmModal";

export default function ExportProductListInfoBox({
  step = "",
  productVariants,
}: {
  step?: string;
  productVariants: ProductVariantResponse[];
}) {
  const { id } = useParams();

  const { exportData, setExportData } = useExport();

  const { confirm, ConfirmationModal } = useConfirmModal();

  const { user } = useAuth();

  const hasStockOutPermission = user?.permissions.includes(
    UserPermissions.STOCK_OUT,
  );

  const productTempData: ProductTempRow[] = exportData.details.map(
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

  const canDelete =
    hasStockOutPermission &&
    step === "quantity-check" &&
    exportData.status === SheetStatus.CREATED;

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
    ...(canDelete
      ? [
          {
            key: "id" as keyof ProductTempRow,
            label: "Action",
            render: (
              _: ProductTempRow[keyof ProductTempRow],
              row: ProductTempRow,
            ) => {
              const detail = exportData.details.find(
                (d) => d.productVariant.id === row.id,
              );
              if (!detail) return null;
              return (
                <Button
                  onClick={() => handleDelete(detail.id)}
                  size="sm"
                  variant="outline"
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash size={15} />
                </Button>
              );
            },
          },
        ]
      : []),
  ];

  const handleDelete = async (detailId: number) => {
    const ok = await confirm({
      title: "Delete product",
      message: "Are you sure you want to remove this product from the export sheet?",
    });
    if (!ok) return;
    try {
      await deleteExportSheetDetail(id as string, detailId);
      setExportData((prev) => ({
        ...prev,
        details: prev.details.filter((d) => d.id !== detailId),
      }));
      toast.success("Deleted successfully");
    } catch {
      toast.error("Failed to delete product");
    }
  };

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
          const existingItem = productTempData.find(
            (product) => product.id === selectedProduct.id,
          );

          if (!existingItem) {
            const data: ExportSheetDetailCreateReq = {
              productVariantId: selectedProduct.id,
              expectedQuantity: selectedProduct.expectedQuantity,
              unitId: selectedProduct.unit.id,
            };
            const res = await createExportSheetDetail(id as string, data);
            return { type: "create" as const, res };
          } else {
            const foundDetail = exportData.details.find(
              (detail) => detail.productVariant.id === selectedProduct.id,
            );
            if (!foundDetail) {
              console.log("Not found correct Detail for", selectedProduct.id);
              return null;
            }

            if (foundDetail.unit?.id !== selectedProduct.unit.id) {
              throw new Error(
                `The unit ${selectedProduct.unit.name} is not equal to ${foundDetail.unit?.name} to update Product Variant ${selectedProduct.id}`,
              );
            }

            const data: ExportSheetDetailUpdateReq = {
              expectedQuantity:
                existingItem.expectedQuantity +
                selectedProduct.expectedQuantity,
            };
            const res = await updateExportSheetDetail(
              id as string,
              foundDetail.id,
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

    setExportData((prev) => {
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
    <>
      {ConfirmationModal}
      <InfoBox
      icon={<FontAwesomeIcon icon={faCube} />}
      title="Product List"
      modal={
        <CustomContentModalBox
          step={step}
          showAddButton={
            step === "quantity-check" &&
            exportData.status === SheetStatus.CREATED &&
            hasStockOutPermission
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
    </>
  );
}
