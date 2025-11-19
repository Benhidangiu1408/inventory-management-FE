import Input from "@/default_components/form/input/InputField";
import InfoBox from "@/default_components/TA_create_page/InfoBox";
import InfoPagination from "@/default_components/TA_create_page/InfoPagination";
import Button from "@/default_components/ui/button/Button";
import { QualityCheckRow } from "@/interfaces/interface.table";
import CustomizableTable, {
  Column,
} from "@/components/table/CustomizableTable";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function QualityCheckPage() {
  const qualityCheckColumn: Column<QualityCheckRow>[] = [
    {
      key: "name",
      label: "Product Name",
    },
    {
      key: "quantity",
      label: "Quantity",
    },
    {
      key: "qualityStatus",
      label: "Quality Status",
      render: () => (
        <div className="inline-flex gap-2">
          <Button variant="success_outline">Pass</Button>
          <Button variant="danger_outline">Fail</Button>
          <Button variant="warning_outline">Skip</Button>
          <Button variant="exempt_outline">Exempt</Button>
        </div>
      ),
    },
    {
      key: "reason",
      label: "Reason",
      render: () => <Input />,
    },
    {
      key: "notes",
      label: "Notes",
      render: () => <Input />,
    },
  ];

  const qualityCheckData: QualityCheckRow[] = [
    {
      name: "Product 1",
      quantity: 10,
      qualityStatus: "Pass",
      reason: "Reason 1",
      notes: "Notes 1",
    },
  ];

  return (
    <div>
      <InfoBox
        icon={<FontAwesomeIcon icon={faCircleCheck} />}
        title="Quality Check"
      >
        <div className="p-6">
          <CustomizableTable<QualityCheckRow>
            headers={qualityCheckColumn}
            data={qualityCheckData}
          />
          <InfoPagination totalPages={4} paginationType="progress" />
        </div>
      </InfoBox>
    </div>
  );
}
