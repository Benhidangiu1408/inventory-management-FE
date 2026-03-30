"use client";

import OrderSummary from "@/components/TA_common/OrderSummary";
import Button from "@/default_components/ui/button/Button";
import AccordionTable from "@/components/table/AccordionTable";
import CustomizableTable from "@/components/table/CustomizableTable";
import { Column } from "@/components/table/CustomizableTable";
import {
  ExportItemModalRow,
  ExportQuantityCheckParentRow,
  ExportQuantityCheckRow,
} from "@/interfaces/interface.table";
import {
  faArrowRight,
  faCircleInfo,
  faEye,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useExport } from "@/context/ExportContext";
import { useState } from "react";
import {
  confirmExportSheet,
  getExportedItemsByBatchId,
} from "@/actions/inbound-outbound";
import toast from "react-hot-toast";
import { Modal } from "@/default_components/ui/modal";
import { useParams, useRouter } from "next/navigation";
import InfoList from "@/components/TA_create_page/InfoList";
import Badge from "@/default_components/ui/badge/Badge";
import InfoBox from "@/components/TA_create_page/InfoBox";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { SheetStatus } from "@/interfaces/inventoryManagementType";
import { Loading } from "@/components/TA_common/Loading";
import SmallInfoBox from "@/components/TA_create_page/SmallInfoBox";

export default function ExportConfirm() {
  const router = useRouter();
  const { type, id } = useParams();
  const { exportData } = useExport();
  const [viewItemsRow, setViewItemsRow] =
    useState<ExportQuantityCheckRow | null>(null);
  const [items, setItems] = useState<ExportItemModalRow[]>([]);
  const [loadingBatchId, setLoadingBatchId] = useState<number | null>(null);
  const [loadingConfirm, setLoadingConfirm] = useState(false);

  const { confirm, ConfirmationModal } = useConfirmModal();

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

  const mainColumns: Column<ExportQuantityCheckParentRow>[] = [
    { key: "productName", label: "Product Name" },
    { key: "description", label: "Description" },
    {
      key: "expectedQuantity",
      label: "Expected Quantity",
      render: (value, row) => {
        return (
          <div>
            {row.expectedQuantity} {row.unit.abb}{" "}
            <span>
              ({row.expectedBaseQuantity} {row.baseUnit.abb})
            </span>
          </div>
        );
      },
    },
    {
      key: "scannedQuantity",
      label: "Scanned Quantity",
      render: (value, row) => {
        const realScannedQuantity =
          row.scannedBaseQuantity / row.conversionRate;

        const isValid =
          realScannedQuantity > 0 && Number.isInteger(realScannedQuantity);

        return (
          <div>
            {isValid ? realScannedQuantity : 0} {row.unit.abb}{" "}
            <span>
              ({row.scannedBaseQuantity} {row.baseUnit.abb})
            </span>
          </div>
        );
      },
    },
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
      unit: detail.unit,
      baseUnit: detail.productVariant.product.baseUnit,
      conversionRate:
        detail.productVariant.product.unitConversions.find(
          (unitConversion) =>
            unitConversion.fromUnit.id === detail.unit.id &&
            unitConversion.toUnit.id ===
              detail.productVariant.product.baseUnit.id,
        )?.conversionRate ?? 1,
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

  const productQuantity = accordionData.length;

  const handleConfirmation = async () => {
    if (accordionData.length === 0) {
      toast.error("No product. Please add more products");
      return;
    }

    const res = accordionData.every(
      (item) => item.scannedBaseQuantity >= item.expectedBaseQuantity,
    );

    const message = res
      ? "Are you sure you want to confirm the Export Sheet?"
      : "Some items have not been fully scanned. Are you sure you want to confirm the Export Sheet?";

    const isConfirmed = await confirm({
      title: "Confirm Export Sheet",
      message: message,
    });

    if (!isConfirmed) return;

    setLoadingConfirm(true);

    await confirmExportSheet(id as string, {
      status: SheetStatus.COMPLETED,
    });

    setLoadingConfirm(false);
    toast.success("Confirm Export Sheet successfully");

    router.refresh();
  };

  return (
    <div className="flex gap-6">
      {loadingConfirm && <Loading />}
      {ConfirmationModal}
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

      <div className="flex flex-3 flex-col gap-6">
        <InfoBox
          icon={<FontAwesomeIcon icon={faCircleInfo} />}
          title={"General Information"}
        >
          {type === "customer" && (
            <InfoList>
              <ul className="flex flex-col gap-4">
                <li>
                  <span className="mr-1 font-bold">Status:</span>
                  <Badge>{exportData.customer.status}</Badge>
                </li>
                <li>
                  <span className="font-bold">Name:</span>{" "}
                  {exportData.customer.name}
                </li>
                <li>
                  <span className="font-bold">Address:</span>{" "}
                  {exportData.customer.address}
                </li>
                <li>
                  <span className="font-bold">Email:</span>{" "}
                  {exportData.customer.email}
                </li>
                <li>
                  <span className="font-bold">Phone Number:</span>{" "}
                  {exportData.customer.phoneNumber}
                </li>
              </ul>
            </InfoList>
          )}

          {type === "internal" && (
            <div className="flex gap-6 p-6">
              <SmallInfoBox
                title="FROM"
                data={{
                  warehouse: exportData.warehouse.id,
                  name: exportData.warehouse.name,
                }}
              />
              <SmallInfoBox
                title="TO"
                data={{
                  warehouse: exportData.destinationWarehouse.id,
                  name: exportData.destinationWarehouse.name,
                }}
              />
            </div>
          )}
        </InfoBox>
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Export Confirm</h2>
          <AccordionTable<ExportQuantityCheckParentRow, ExportQuantityCheckRow>
            headers={mainColumns}
            data={accordionData}
            subTableKey="locations"
            subTableHeaders={subTableColumns}
            getRowId={(params) => String(params.data.detailId)}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-6">
        <OrderSummary products={productQuantity} quantity={totalQuantity} />
        {exportData.status !== SheetStatus.COMPLETED && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg">Confirmation</h2>
            <Button className="w-full" size="md" onClick={handleConfirmation}>
              <FontAwesomeIcon icon={faArrowRight} /> Confirm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
