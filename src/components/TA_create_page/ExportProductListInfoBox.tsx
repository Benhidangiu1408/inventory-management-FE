"use client";

import { useCallback, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InfoBox from "./InfoBox";
import { faCube, faPlus } from "@fortawesome/free-solid-svg-icons";
import CustomContentModalBox from "../modal/CustomContentModalBox";
import ExportCreateModal from "./ExportCreateModal";
import { ProductTempRow } from "../../interfaces/interface.table";
import { Column } from "../table/CustomizableTable";
import AsyncAccordionTable from "../table/AsyncAccordionTable";
import {
  AttributeResponse,
  BatchResponse,
  ExportSheetDetailCreateReq,
  ExportSheetDetailUpdateReq,
  ProductVariantStockResponse,
} from "@/interfaces/inboundOutboundType";
import { useExport } from "@/context/ExportContext";
import toast from "react-hot-toast";
import { SheetStatus } from "@/interfaces/inventoryManagementType";
import { useParams } from "next/navigation";
import {
  createExportSheetDetail,
  deleteExportSheetDetail,
  getBatchesByProductVariantId,
  updateExportSheetDetail,
} from "@/actions/inbound-outbound";
import { ApiError } from "next/dist/server/api-utils";
import { useAuth } from "@/context/AuthContext";
import { UserPermissions } from "@/interfaces/userManagementType";
import Button from "@/default_components/ui/button/Button";
import { Trash } from "lucide-react";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import Badge from "@/default_components/ui/badge/Badge";

export default function ExportProductListInfoBox({
  step = "",
  productVariants,
}: {
  step?: string;
  productVariants: ProductVariantStockResponse[];
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
      detailId: detail.id,
      id: detail.productVariant.id,
      name: detail.productVariant.product.name,
      description: detail.productVariant.description,
      expectedQuantity: detail.expectedQuantity ?? 0,
      unit: detail.unit ?? detail.productVariant.product.baseUnit,
      attributes: detail.productVariant.attributes ?? [],
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

  const handleDelete = async (detailId: number) => {
    const ok = await confirm({
      title: "Delete product",
      message:
        "Are you sure you want to remove this product from the export sheet?",
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

  const productTempColumn: Column<ProductTempRow>[] = useMemo(
    () => [
      {
        key: "name",
        label: "Product Name",
      },
      {
        key: "description",
        label: "Description",
      },
      {
        key: "attributes",
        label: "Attributes",
        filter: false,
        render: (attrs) => {
          const attributeArray = attrs as AttributeResponse[];
          if (!Array.isArray(attributeArray) || attributeArray.length === 0)
            return <span className="text-gray-400 italic">Default</span>;
          return (
            <div className="flex h-full w-full flex-wrap items-center justify-center gap-1 py-1">
              {attributeArray.map((attr) => (
                <span
                  key={attr.id}
                  className="inline-flex items-center rounded border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                >
                  <span className="mr-1 font-semibold">{attr.name}:</span>{" "}
                  {attr.value}
                </span>
              ))}
            </div>
          );
        },
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
              key: "detailId" as keyof ProductTempRow,
              label: "Action",
              render: (
                _: ProductTempRow[keyof ProductTempRow],
                row: ProductTempRow,
              ) => (
                <Button
                  onClick={() => handleDelete(row.detailId)}
                  size="sm"
                  variant="outline"
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash size={15} />
                </Button>
              ),
            },
          ]
        : []),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canDelete],
  );

  const batchColumns: Column<BatchResponse>[] = useMemo(
    () => [
      {
        label: "Batch Code",
        key: "code",
      },
      {
        label: "Location",
        key: "location",
        render: (_, row) =>
          row.location ? `${row.location.code} — ${row.location.name}` : "—",
      },
      {
        label: "Quantity",
        key: "baseQuantity",
      },
      {
        label: "Unit",
        key: "unit",
        render: (_, row) => row.unit?.name ?? "—",
      },
      {
        label: "Status",
        key: "status",
        render: (_, row) => <Badge color="success">{row.status}</Badge>,
      },
    ],
    [],
  );

  const getDetailRowDataFn = useCallback(
    async (row: ProductTempRow): Promise<BatchResponse[]> => {
      return getBatchesByProductVariantId(row.id);
    },
    [],
  );

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
              <ExportCreateModal
                productVariants={productVariants}
                onSelectedProductsChange={setSelectedProducts}
                onHasInvalidChange={setHasInvalidSelection}
              />
            }
          />
        }
      >
        <div className="p-6">
          <AsyncAccordionTable<ProductTempRow, BatchResponse>
            headers={productTempColumn}
            data={productTempData}
            getDetailRowDataFn={getDetailRowDataFn}
            subTableHeaders={batchColumns}
            subTableGetRowId={(params) => String(params.data.id)}
            getRowId={(params) => String(params.data.id)}
          />
        </div>
      </InfoBox>
    </>
  );
}
