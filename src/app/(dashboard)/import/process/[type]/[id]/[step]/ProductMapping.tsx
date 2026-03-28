"use client";

import InfoBox from "@/components/TA_create_page/InfoBox";
import CustomizableTable, {
  Column,
} from "@/components/table/CustomizableTable";
import { useImport } from "@/context/ImportContext";
import Select from "@/default_components/form/Select";
import Button from "@/default_components/ui/button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeCompare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { ProductMappingRow } from "@/interfaces/interface.table";
import { useProductVariant } from "@/context/ProductVariantContext";
import {
  updateImportSheet,
  updateImportSheetDetail,
} from "@/actions/inbound-outbound";
import { ImportSheetDetailMappingStatus } from "@/interfaces/inboundOutboundType";
import { SheetStatus } from "@/interfaces/inventoryManagementType";
import { useConfirmModal } from "@/hooks/useConfirmModal";

export default function ProductMappingPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { type, id } = useParams();
  const { importData } = useImport();
  const { productVariants } = useProductVariant();
  const { confirm, ConfirmationModal } = useConfirmModal();

  const disableAllButtons = importData.status !== SheetStatus.WAIT_FOR_MAPPING;

  const mappedDetailIdsFromStatus = useMemo(() => {
    const mapped = importData.details
      .filter(
        (d) =>
          d.mappingStatus === ImportSheetDetailMappingStatus.MANUAL_MAPPED ||
          d.mappingStatus === ImportSheetDetailMappingStatus.AUTO_MAPPED,
      )
      .map((d) => d.id);
    return new Set<number>(mapped);
  }, [importData.details]);

  const [mappedDetailIds, setMappedDetailIds] = useState<Set<number>>(
    () => mappedDetailIdsFromStatus,
  );

  const initRows = useMemo<ProductMappingRow[]>(
    () =>
      importData.details.map((detail, idx) => ({
        detailId: detail.id,
        index: idx + 1,
        rawProductName: detail.rawProductName ?? "N/A",
        rawSku: detail.rawSku ?? "N/A",
        rawUnit: detail.rawUnitName ?? "N/A",
        expectedQuantity: detail.expectedQuantity ?? 0,
        systemProductId: detail.productVariant
          ? String(detail.productVariant.id)
          : "",
        systemUnitId: String(
          detail.unit?.id ?? detail.productVariant?.product.baseUnit.id ?? "",
        ),
        mappingStatus: detail.mappingStatus,
      })),
    [importData.details],
  );

  const [rows, setRows] = useState<ProductMappingRow[]>(initRows);

  const productOptions = useMemo(
    () =>
      (productVariants ?? []).map((productVariant) => ({
        label: `${productVariant.code} - ${productVariant.product.name} - ${productVariant.description}`,
        value: String(productVariant.id),
      })),
    [productVariants],
  );

  const getUnitOptions = useCallback(
    (row: ProductMappingRow) => {
      const selectedProduct = productVariants?.find(
        (productVariant) => String(productVariant?.id) === row.systemProductId,
      )?.product;

      if (!selectedProduct) {
        return [];
      }

      return [
        {
          value: String(selectedProduct.baseUnit.id),
          label: selectedProduct.baseUnit.name,
        },
        ...selectedProduct.unitConversions.map((conversion) => ({
          value: String(conversion.fromUnit.id),
          label: conversion.fromUnit.name,
        })),
      ];
    },
    [productVariants],
  );

  const handleChangeSystemProduct = useCallback(
    (detailId: number, productId: string) => {
      setRows((prev) =>
        prev.map((row) => {
          if (row.detailId !== detailId) return row;
          const foundProductVariant = (productVariants ?? []).find(
            (productVariant) => productVariant.id === Number(productId),
          );
          return {
            ...row,
            systemProductId: productId,
            systemUnitId: foundProductVariant
              ? String(foundProductVariant.product.baseUnit.id ?? "")
              : "",
            // User changed the selection => not mapped anymore until pressing "Map"
            mappingStatus: ImportSheetDetailMappingStatus.UNMAPPED,
          };
        }),
      );
      setMappedDetailIds((prev) => {
        const next = new Set(prev);
        next.delete(detailId);
        return next;
      });
    },
    [productVariants],
  );

  const handleChangeSystemUnit = (detailId: number, unitId: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.detailId === detailId
          ? {
              ...row,
              systemUnitId: unitId,
              // User changed the selection => not mapped anymore until pressing "Map"
              mappingStatus: ImportSheetDetailMappingStatus.UNMAPPED,
            }
          : row,
      ),
    );
    setMappedDetailIds((prev) => {
      const next = new Set(prev);
      next.delete(detailId);
      return next;
    });
  };

  const unmappedCount = useMemo(() => {
    if (!rows.length) return 0;
    return rows.filter((row) => !mappedDetailIds.has(row.detailId)).length;
  }, [mappedDetailIds, rows]);

  const canContinue = unmappedCount === 0 && rows.length > 0;

  const handleMapDetail = useCallback(
    async (row: ProductMappingRow) => {
      const data = {
        productVariantId: Number(row.systemProductId),
        unitId: Number(row.systemUnitId),
        expectedQuantity: row.expectedQuantity,
        mappingStatus: ImportSheetDetailMappingStatus.MANUAL_MAPPED,
      };

      await updateImportSheetDetail(id as string, row.detailId, data);

      setMappedDetailIds((prev) => {
        const next = new Set(prev);
        next.add(row.detailId);
        return next;
      });

      setRows((prev) =>
        prev.map((r) =>
          r.detailId === row.detailId
            ? {
                ...r,
                mappingStatus: ImportSheetDetailMappingStatus.MANUAL_MAPPED,
              }
            : r,
        ),
      );
    },
    [id],
  );

  const handleOpenCreateProduct = useCallback(() => {
    router.push(
      `/catalog/product/new?returnTo=${encodeURIComponent(pathname)}`,
    );
  }, [router, pathname]);

  const handleOpenCreateVariant = useCallback(
    (productId: number) => {
      router.push(
        `/catalog/product/${productId}/variant/new?returnTo=${encodeURIComponent(pathname)}`,
      );
    },
    [router, pathname],
  );

  const mappingColumns: Column<ProductMappingRow>[] = useMemo(
    () => [
      {
        key: "index",
        label: "#",
      },
      {
        key: "rawProductName",
        label: "Raw product name",
        render: (value) => (
          <span className="text-sm text-gray-700">{String(value)}</span>
        ),
      },
      {
        key: "rawSku",
        label: "Raw SKU",
        render: (value) => (
          <span className="text-sm text-gray-700">{String(value)}</span>
        ),
      },
      {
        key: "rawUnit",
        label: "Raw unit",
        render: (value) => (
          <span className="text-sm text-gray-700">{String(value)}</span>
        ),
      },
      {
        key: "expectedQuantity",
        label: "Expected quantity",
        render: (value) => (
          <span className="text-sm text-gray-700">{String(value)}</span>
        ),
      },
      {
        key: "systemProductId",
        label: "System product",
        minWidth: 420,
        render: (value, row) => {
          const selectedVariant = productVariants?.find(
            (v) => String(v.id) === row.systemProductId,
          );
          const parentProductId = selectedVariant?.product.id;

          return (
            <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <Select
                  value={String(value)}
                  disabled={disableAllButtons}
                  onChange={(e) =>
                    handleChangeSystemProduct(row.detailId, e.target.value)
                  }
                  options={productOptions}
                  placeholder="Select variant"
                  className="h-[38px] w-full py-0 text-sm"
                />
              </div>
              <div className="grid w-full grid-cols-2 gap-1 sm:flex sm:w-auto sm:shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  className="h-[38px] justify-center text-sm sm:min-w-[6.75rem]"
                  disabled={disableAllButtons}
                  onClick={handleOpenCreateProduct}
                  title="Create a new catalog product"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-1" />
                  Product
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  className="h-[38px] justify-center text-sm sm:min-w-[6.75rem]"
                  disabled={disableAllButtons || parentProductId === undefined}
                  onClick={() =>
                    parentProductId !== undefined &&
                    handleOpenCreateVariant(parentProductId)
                  }
                  title="Add a variant under the same product as the selected row (pick any existing variant of that product first)"
                >
                  Variant
                </Button>
              </div>
            </div>
          );
        },
      },
      {
        key: "systemUnitId",
        label: "System unit",
        render: (value, row) => {
          const unitOptions = getUnitOptions(row);
          return (
            <Select
              value={String(value)}
              disabled={disableAllButtons}
              onChange={(e) =>
                handleChangeSystemUnit(row.detailId, e.target.value)
              }
              options={unitOptions}
              placeholder="Unit"
              className="h-[38px] w-full py-0 text-sm"
            />
          );
        },
      },
      {
        key: "mappingStatus",
        label: "Mapping",
        minWidth: 140,
        render: (_, row) => {
          const isMappable = Boolean(row.systemProductId && row.systemUnitId);
          const isMapped = mappedDetailIds.has(row.detailId);
          return (
            <Button
              size="sm"
              type="button"
              className="h-[38px] text-sm"
              disabled={disableAllButtons || !isMappable || isMapped}
              variant={isMapped ? "outline" : "primary"}
              onClick={() => handleMapDetail(row)}
            >
              {isMapped ||
              row.mappingStatus ===
                ImportSheetDetailMappingStatus.MANUAL_MAPPED ||
              row.mappingStatus === ImportSheetDetailMappingStatus.AUTO_MAPPED
                ? "Mapped"
                : "Map"}
            </Button>
          );
        },
      },
    ],
    [
      disableAllButtons,
      getUnitOptions,
      handleChangeSystemProduct,
      handleMapDetail,
      handleOpenCreateProduct,
      handleOpenCreateVariant,
      mappedDetailIds,
      productOptions,
      productVariants,
    ],
  );

  const handleConfirmProductMapping = async () => {
    const data = {
      status: SheetStatus.CREATED,
    };

    await updateImportSheet(id as string, data);

    router.push(`/import/process/${type}/${id}/quantity-check`);
  };

  const handleOpenConfirmModal = async () => {
    const isConfirmed = await confirm({
      title: "Confirm Product Mapping",
      message:
        "Are you sure you want to confirm the product mapping for all rows?",
    });

    if (!isConfirmed) return;

    await handleConfirmProductMapping();
  };

  return (
    <div>
      {ConfirmationModal}
      <InfoBox
        icon={<FontAwesomeIcon icon={faCodeCompare} />}
        title="Product Mapping"
        description="Map supplier products to system products before proceeding"
      >
        <div className="flex flex-col gap-6 p-6">
          <div className="flex justify-end">
            <div className="bg-warning-50 text-warning-600 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
              <span className="bg-warning-600 h-1.5 w-1.5 rounded-full" />
              {unmappedCount} unmapped
            </div>
          </div>

          <CustomizableTable<ProductMappingRow>
            headers={mappingColumns}
            data={rows}
            getRowId={(params) => String(params.data.detailId)}
          />

          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              All products must be mapped before proceeding to quantity check
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                className="h-[38px] text-sm"
                disabled={disableAllButtons || !canContinue}
                onClick={handleOpenConfirmModal}
              >
                Confirm Product Mapping
              </Button>
            </div>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}
