"use client";

import { Column } from "@/components/table/CustomizableTable";
import AccordionTable from "@/components/table/AccordionTable";
import InfoBox from "@/components/TA_create_page/InfoBox";
import { ExportQuantityCheckRow } from "@/interfaces/interface.table";
import Button from "@/default_components/ui/button/Button";
import Input from "@/default_components/form/input/InputField";
import { Modal } from "@/default_components/ui/modal";
import Link from "next/link";
import {
  faArrowRight,
  faCircleCheck,
  faBarcode,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "next/navigation";
import { useExport } from "@/context/ExportContext";
import { useState } from "react";
import { updateExportSheetDetail } from "@/actions/inbound-outbound";
import toast from "react-hot-toast";
import { ApiError } from "next/dist/server/api-utils";

/** Parent row: one per product, with expandable location/quantity sub-table */
interface ExportQuantityCheckParentRow {
  /** ID phiếu xuất detail (để biết đang scan cho dòng nào khi gọi API) */
  detailId: number;
  productName: string;
  description: string;
  expectedQuantity: number;
  scannedQuantity: number;
  locations: ExportQuantityCheckRow[];
  /** Chỉ dùng cho cột nút Scan Item, không lưu trong data */
  scanItem?: never;
}

// const defaultLocationData: ExportQuantityCheckRow[] = [
//   { quantity: 10, location: "Warehouse B/ Shelf A" },
//   { quantity: 10, location: "Warehouse C/ Shelf D" },
//   { quantity: 30, location: "Warehouse F/ Shelf H" },
// ];

const subTableColumns: Column<ExportQuantityCheckRow>[] = [
  { key: "batchId", label: "Batch ID" },
  { key: "quantity", label: "Quantity" },
  { key: "location", label: "Location" },
];

export default function ExportQuantityCheck() {
  const params = useParams();
  const { type, id } = params;
  const { exportData, setExportData } = useExport();
  const [scanningRow, setScanningRow] =
    useState<ExportQuantityCheckParentRow | null>(null);
  const [itemBarCode, setItemBarCode] = useState("");

  const mainColumns: Column<ExportQuantityCheckParentRow>[] = [
    { key: "productName", label: "Product Name" },
    { key: "description", label: "Description" },
    { key: "expectedQuantity", label: "Expected Quantity" },
    { key: "scannedQuantity", label: "ScannedQuantity Quantity" },
    {
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
    },
  ];

  const accordionData: ExportQuantityCheckParentRow[] = exportData.details.map(
    (detail) => ({
      detailId: detail.id,
      productName: detail.productVariant.product.name,
      description: detail.productVariant.description,
      expectedQuantity: detail.expectedQuantity ?? 0,
      scannedQuantity: detail.batches.reduce(
        (sum, item) => sum + (item.quantity ?? 0),
        0,
      ),
      locations: detail.batches.map((item) => ({
        batchId: item.batch.code,
        quantity: item.quantity,
        location: `${item.batch.location.code} - ${item.batch.location.name}`,
      })),
    }),
  );

  const totalQuantity = accordionData.reduce(
    (sum, row) => sum + row.expectedQuantity,
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
    } catch (err: unknown) {
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
          />
        </div>
      </InfoBox>

      <div className="flex justify-end">
        <Link href={`/export/process/${type}/${id}/confirm`}>
          <Button size="md" endIcon={<FontAwesomeIcon icon={faArrowRight} />}>
            Continue
          </Button>
        </Link>
      </div>
    </div>
  );
}
