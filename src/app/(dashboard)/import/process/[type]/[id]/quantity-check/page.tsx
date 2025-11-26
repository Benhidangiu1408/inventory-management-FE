"use client";

import InfoBox from "@/components/TA_create_page/InfoBox";
import { QuantityCheckRow } from "@/interfaces/interface.table";
import CustomizableTable, {
  Column,
} from "@/components/table/CustomizableTable";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "@/default_components/form/input/InputField";

export default function ImportProcessPage() {
  const quantityCheckColumn: Column<QuantityCheckRow>[] = [
    {
      key: "name",
      label: "Product Name",
    },
    {
      key: "expectedQuantity",
      label: "Expected Quantity",
    },
    {
      key: "actualQuantity",
      label: "Actual Quantity",
      render: () => {
        return <Input className="h-full" />;
      },
    },
    {
      key: "variance",
      label: "Variance",
    },
    {
      key: "reason",
      label: "Reason",
      render: () => {
        return <Input className="h-full" />;
      },
    },
  ];

  const quantityCheckData: QuantityCheckRow[] = [
    {
      name: "Product 1",
      expectedQuantity: 10,
      actualQuantity: 10,
      variance: 0,
      reason: "Reason 1",
    },
  ];

  return (
    <div>
      <InfoBox
        icon={<FontAwesomeIcon icon={faCircleCheck} />}
        title="Quantity Check"
      >
        <div className="p-6">
          <CustomizableTable<QuantityCheckRow>
            headers={quantityCheckColumn}
            data={quantityCheckData}
            height={"auto"}
          />
          {/* <InfoPagination totalPages={4} paginationType="progress" /> */}
        </div>
      </InfoBox>
    </div>
  );
}
