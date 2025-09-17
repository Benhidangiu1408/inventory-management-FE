import Input from "@/components/form/input/InputField";
import CustomTable from "@/components/TA_common/CustomTable";
import InfoBox from "@/components/TA_create_page/InfoBox";
import InfoPagination from "@/components/TA_create_page/InfoPagination";
import Button from "@/components/ui/button/Button";
import { Column, QualityCheckRow } from "@/interfaces/interface.table";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function QualityCheckPage() {
  const qualityCheckColumn: Column<QualityCheckRow>[] = [
    {
      key: "name",
      header: "Product Name",
    },
    {
      key: "quantity",
      header: "Quantity",
    },
    {
      key: "qualityStatus",
      header: "Quality Status",
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
      header: "Reason",
      render: () => <Input />,
    },
    {
      key: "notes",
      header: "Notes",
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
        title="Quantity Check"
      >
        <div className="p-6">
          <CustomTable<QualityCheckRow>
            columns={qualityCheckColumn}
            data={qualityCheckData}
          />
          <InfoPagination totalPages={4} paginationType="progress" />
        </div>
      </InfoBox>
    </div>
  );
}
