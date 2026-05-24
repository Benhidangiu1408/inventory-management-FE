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
  deleteImportSheetDetail,
  updateImportSheetDetail,
} from "@/actions/inbound-outbound";
import { ApiError } from "next/dist/server/api-utils";
import { useAuth } from "@/context/AuthContext";
import { UserPermissions } from "@/interfaces/userManagementType";
import Button from "@/default_components/ui/button/Button";
import EditableQuantity from "./EditableQuantity";
import { Trash } from "lucide-react";
import { useConfirmModal } from "@/hooks/useConfirmModal";

export default function ProductListInfoBox({
  step = "",
  productVariants,
}: {
  step?: string;
  productVariants: ProductVariantResponse[];
}) {
  const params = useParams();

  const { id } = params;

  const { importData, setImportData, setIsDirty } = useImport();

  const details = importData.details;

  const { confirm, ConfirmationModal } = useConfirmModal();

  const { user } = useAuth();
  const hasStockInPermission = user?.permissions.includes(
    UserPermissions.STOCK_IN,
  );

  const productTempData: ProductTempRow[] = importData.details.map(
    (detail) => ({
      detailId: detail.id,
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

  const canDelete = step === "quantity-check";

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
      render: (_, row) => {
        if (!canDelete) return row.expectedQuantity;
        return (
          <EditableQuantity
            initialValue={row.expectedQuantity}
            onSave={async (value) => {
              const data: ImportSheetDetailUpdateReq = {
                productVariantId: row.id,
                expectedQuantity: value,
                unitId: row.unit.id,
              };
              const updated = await updateImportSheetDetail(
                id as string,
                row.detailId,
                data,
              );
              setImportData((prev) => ({
                ...prev,
                details: prev.details.map((d) =>
                  d.id === updated.id ? updated : d,
                ),
              }));
            }}
          />
        );
      },
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
              return (
                <Button
                  onClick={() => handleDelete(row.detailId)}
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
      message:
        "Are you sure you want to remove this product from the import sheet?",
    });
    if (!ok) return;
    try {
      await deleteImportSheetDetail(id as string, detailId);
      setImportData((prev) => ({
        ...prev,
        details: prev.details.filter((d) => d.id !== detailId),
      }));
      setIsDirty(true);
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
          const data: ImportSheetDetailCreateReq = {
            productVariantId: selectedProduct.id,
            expectedQuantity: selectedProduct.expectedQuantity,
            unitId: selectedProduct.unit.id,
          };
          const res = await createImportSheetDetail(id as string, data);
          return { type: "create" as const, res };
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

    setImportData((prev) => ({
      ...prev,
      details: [...prev.details, ...results.map((r) => r.res)],
    }));
    setIsDirty(true);
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
            // showAddButton={
            //   hasStockInPermission &&
            //   step === "quantity-check" &&
            //   importData.status === SheetStatus.CREATED &&
            //   importData.type !== ImportSheetType.EXTERNAL_SUPPLIER &&
            //   importData.type !== ImportSheetType.INTERNAL
            // }
            showAddButton={step === "quantity-check"}
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
            getRowId={(params) => String(params.data.detailId)}
          />
        </div>
      </InfoBox>
    </>
  );
}
