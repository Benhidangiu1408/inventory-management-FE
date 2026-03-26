"use client";

import { Column } from "@/components/table/CustomizableTable";
import AccordionTable from "@/components/table/AccordionTable";
import CustomizableTable from "@/components/table/CustomizableTable";
import InfoBox from "@/components/TA_create_page/InfoBox";
import {
  ExportItemModalRow,
  ExportQuantityCheckParentRow,
  ExportQuantityCheckRow,
} from "@/interfaces/interface.table";
import Button from "@/default_components/ui/button/Button";
import Input from "@/default_components/form/input/InputField";
import { Modal } from "@/default_components/ui/modal";
import Link from "next/link";
import {
  faArrowRight,
  faCircleCheck,
  faBarcode,
  faEye,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "next/navigation";
import { useExport } from "@/context/ExportContext";
import { useState } from "react";
import {
  getExportedItemsByBatchId,
  updateExportSheetDetail,
} from "@/actions/inbound-outbound";
import toast from "react-hot-toast";
import { SheetStatus } from "@/interfaces/inventoryManagementType";

export default function ExportQuantityCheck() {
  const params = useParams();
  const { type, id } = params;
  const { exportData, setExportData } = useExport();
  const [scanningRow, setScanningRow] =
    useState<ExportQuantityCheckParentRow | null>(null);
  const [itemBarCode, setItemBarCode] = useState("");
  const [viewItemsRow, setViewItemsRow] =
    useState<ExportQuantityCheckRow | null>(null);
  const [items, setItems] = useState<ExportItemModalRow[]>([]);
  const [loadingBatchId, setLoadingBatchId] = useState<number | null>(null);

  const itemModalColumns: Column<ExportItemModalRow>[] = [
    { key: "itemId", label: "Item ID" },
    { key: "barcode", label: "Barcode" },
    { key: "serialNumber", label: "Serial Number" },
  ];

  const subTableColumns: Column<ExportQuantityCheckRow>[] = [
    { key: "batchCode", label: "Batch Code" },
    { key: "quantity", label: "Quantity" },
    { key: "location", label: "Location" },
    {
      key: "actions",
      label: "Actions",
      render: (_value, row) => {
        const isLoading = loadingBatchId === row.batchId;
        return (
          <Button
            variant="primary"
            size="sm"
            disabled={isLoading}
            onClick={async () => {
              setLoadingBatchId(row.batchId);
              try {
                console.log(row.batchId);
                const res = await getExportedItemsByBatchId(
                  row.batchId,
                  row.detailId,
                );
                setItems(res);
                setViewItemsRow(row);
              } catch (err: unknown) {
                toast.error(
                  err instanceof Error ? err.message : "Failed to load items",
                );
              } finally {
                setLoadingBatchId(null);
              }
            }}
            aria-label="View items"
          >
            <FontAwesomeIcon
              icon={isLoading ? faSpinner : faEye}
              className={isLoading ? "animate-spin" : ""}
            />
          </Button>
        );
      },
    },
  ];

  const scanItemColumn: Column<ExportQuantityCheckParentRow> = {
    key: "scanItem",
    label: "Scan Item",
    render: (_value, row) => (
      <Button
        size="sm"
        variant="outline"
        onClick={() => setScanningRow(row)}
        className="h-[35px] w-full"
        startIcon={<FontAwesomeIcon icon={faBarcode} />}
      >
        Scan Item
      </Button>
    ),
  };

  const mainColumns: Column<ExportQuantityCheckParentRow>[] = [
    { key: "productName", label: "Product Name" },
    { key: "description", label: "Description" },
    { key: "expectedQuantity", label: "Expected Quantity" },
    { key: "expectedBaseQuantity", label: "Expected Base Quantity" },
    { key: "scannedQuantity", label: "Scanned Quantity" },
    { key: "scannedBaseQuantity", label: "Scanned Base Quantity" },
    ...(exportData.status !== SheetStatus.COMPLETED ? [scanItemColumn] : []),
  ];

  const accordionData: ExportQuantityCheckParentRow[] = exportData.details.map(
    (detail) => ({
      detailId: detail.id,
      productName: detail.productVariant.product.name,
      description: detail.productVariant.description,
      expectedQuantity: detail.expectedQuantity ?? 0,
      scannedQuantity: 0,
      expectedBaseQuantity: detail.expectedBaseQuantity ?? 0,
      scannedBaseQuantity: detail.batches.reduce(
        (sum, item) => sum + (item.quantity ?? 0),
        0,
      ),
      locations: detail.batches.map((item) => ({
        detailId: detail.id,
        batchId: item.batch.id,
        batchCode: item.batch.code,
        quantity: item.quantity,
        location: `${item.batch.location.code} - ${item.batch.location.name}`,
      })),
    }),
  );

  const totalQuantity = accordionData.reduce(
    (sum, row) => sum + row.scannedBaseQuantity,
    0,
  );

  const handleCloseScanModal = () => {
    setScanningRow(null);
    setItemBarCode("");
  };

  const handleScan = async () => {
    if (!scanningRow) return;
    // scanningRow.detailId = ID dòng phiếu xuất đang scan
    // itemBarCode = mã vạch vừa nhập
    // TODO: gọi API cập nhật scan cho detailId với itemBarCode

    try {
      const res = await updateExportSheetDetail(
        id as string,
        scanningRow.detailId,
        {
          itemBarcode: itemBarCode,
        },
      );

      setExportData((prev) => ({
        ...prev,
        details: prev.details.map((detail) => {
          if (detail.id !== scanningRow.detailId) return detail;

          return {
            ...detail,
            batches: res.batches, // backend trả batches mới
          };
        }),
      }));

      console.log(res);

      toast.success("Scan Item Successfully");

      handleCloseScanModal();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <Modal
        isOpen={scanningRow !== null}
        onClose={handleCloseScanModal}
        className="max-w-md px-6 py-10"
      >
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Scan Item Barcode
            {scanningRow && (
              <span className="ml-2 font-normal text-gray-500">
                — {scanningRow.productName}
              </span>
            )}
          </h3>
          <Input
            placeholder="Scan Item BarCode"
            value={itemBarCode}
            onChange={(e) => setItemBarCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleScan()}
            className="h-11"
          />
          <div className="flex justify-end gap-2">
            <Button size="md" onClick={handleScan}>
              Scan
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={viewItemsRow !== null}
        onClose={() => {
          setViewItemsRow(null);
          setItems([]);
        }}
        className="max-w-4xl px-6 py-3"
      >
        <div className="flex w-full flex-col gap-4 py-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Items
            {viewItemsRow && (
              <span className="ml-2 font-normal text-gray-500">
                — Batch: {viewItemsRow.batchCode}
              </span>
            )}
          </h3>
          <div className="">
            <CustomizableTable<ExportItemModalRow>
              headers={itemModalColumns}
              data={items}
            />
          </div>
        </div>
      </Modal>
      <InfoBox
        icon={<FontAwesomeIcon icon={faCircleCheck} />}
        title="Quantity Check"
      >
        <div className="flex flex-col gap-4 p-6">
          <div className="flex flex-col gap-1">
            <div className="text-brand-500 font-bold">
              Total Quantity: {totalQuantity}
            </div>
          </div>
          <AccordionTable<ExportQuantityCheckParentRow, ExportQuantityCheckRow>
            headers={mainColumns}
            data={accordionData}
            subTableKey="locations"
            subTableHeaders={subTableColumns}
            getRowId={(params) => String(params.data.detailId)}
          />

          <div className="flex justify-end">
            <Link href={`/export/process/${type}/${id}/confirm`}>
              <Button
                size="md"
                endIcon={<FontAwesomeIcon icon={faArrowRight} />}
              >
                Confirm
              </Button>
            </Link>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}
