"use client";

import Input from "@/default_components/form/input/InputField";
import InfoBox from "@/components/TA_create_page/InfoBox";
// import InfoPagination from "@/default_components/TA_create_page/InfoPagination";
import Button from "@/default_components/ui/button/Button";
import { QualityCheckRow } from "@/interfaces/interface.table";
import CustomizableTable, {
  Column,
} from "@/components/table/CustomizableTable";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQualityCheck } from "@/context/QualityCheckContext";

export default function QualityCheckPage() {
  const { qcData } = useQualityCheck();

  const qualityCheckColumn: Column<QualityCheckRow>[] = [
    {
      key: "batchCode",
      label: "Batch Code",
    },
    {
      key: "name",
      label: "Product Name",
    },
    {
      key: "description",
      label: "Description",
    },
    {
      key: "quantity",
      label: "Quantity",
    },
    {
      key: "qualityStatus",
      label: "Quality Status",
      render: () => (
        <div className="inline-flex h-full w-full gap-2">
          <Button size="sm" className="h-[35px]" variant="success_outline">
            Pass
          </Button>
          <Button size="sm" className="h-[35px]" variant="danger_outline">
            Fail
          </Button>
          <Button size="sm" className="h-[35px]" variant="warning_outline">
            Skip
          </Button>
          <Button size="sm" className="h-[35px]" variant="exempt_outline">
            Exempt
          </Button>
        </div>
      ),
    },
    {
      key: "reason",
      label: "Reason",
      render: () => <Input className="h-[35px]" />,
    },
    {
      key: "notes",
      label: "Notes",
      render: () => <Input className="h-[35px]" />,
    },
  ];

  const rows: QualityCheckRow[] =
    qcData?.details.map((detail) => ({
      detailId: detail.id,
      batchCode: detail.batch.code,
      name: detail.batch.productVariant.product.name,
      description: detail.batch.productVariant.description,
      quantity: detail.batch.initialQuantity,
      qualityStatus: "Pass",
      reason: "",
      notes: "",
    })) ?? [];

  return (
    <div>
      <InfoBox
        icon={<FontAwesomeIcon icon={faCircleCheck} />}
        title="Quality Check"
      >
        <div className="p-6">
          <CustomizableTable<QualityCheckRow>
            headers={qualityCheckColumn}
            data={rows}
          />
        </div>
      </InfoBox>
    </div>
  );
}
