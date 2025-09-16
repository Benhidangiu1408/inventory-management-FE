/* eslint-disable @typescript-eslint/no-unused-vars */
import CustomTable from "@/components/TA_common/CustomTable";
import InfoBox from "@/components/TA_create_page/InfoBox";
import { Column, QuantityCheckRow } from "@/interfaces/interface.table";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "@/components/form/input/InputField";
import InfoPagination from "@/components/TA_create_page/InfoPagination";

export default function ImportProcessPage() {
  const quantityCheckColumn: Column<QuantityCheckRow>[] = [
    {
      key: "name",
      header: "Product Name",
    },
    {
      key: "expectedQuantity",
      header: "Expected Quantity",
    },
    {
      key: "actualQuantity",
      header: "Actual Quantity",
      render: (
        value: QuantityCheckRow[keyof QuantityCheckRow],
        row: QuantityCheckRow,
      ) => {
        return <Input />;
      },
    },
    {
      key: "variance",
      header: "Variance",
    },
    {
      key: "reason",
      header: "Reason",
      render: (
        value: QuantityCheckRow[keyof QuantityCheckRow],
        row: QuantityCheckRow,
      ) => {
        return <Input />;
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
          <CustomTable<QuantityCheckRow>
            columns={quantityCheckColumn}
            data={quantityCheckData}
          />
          <InfoPagination totalPages={4} />
        </div>
      </InfoBox>
    </div>
  );
}
