import CustomizableTable, {
  type Column,
} from "@/components/table/CustomizableTable";
import type { FaultBatch as FaultBatchRow } from "@/components/table/CustomizableTableHeader";

type AssignTaskProcessingSectionProps = {
  faultBatchRows: FaultBatchRow[];
  faultBatchColumns: Column<FaultBatchRow>[];
};

export default function AssignTaskProcessingSection({
  faultBatchRows,
  faultBatchColumns,
}: AssignTaskProcessingSectionProps) {
  return (
    <div>
      <h2 className="pb-4 text-xl font-semibold">Processing</h2>
      <CustomizableTable headers={faultBatchColumns} data={faultBatchRows} />
    </div>
  );
}
