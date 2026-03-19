import { CreateICSheetForm } from "@/components/form/CreateICSheetForm";
import Calendar from "@/default_components/calendar/Calendar";
import ComponentCard from "@/default_components/common/ComponentCard";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import {
  ProductResponse,
  WarehouseGeneral,
} from "@/interfaces/warehouseManagementType";
import {
  productService,
  warehouseService,
} from "@/services/WarehouseManagementService";

export default async function CreateICPage() {
  let warehouseData: WarehouseGeneral[] = [];
  let productData: ProductResponse[] = [];
  let errorMsg = null;

  try {
    warehouseData = await warehouseService.getAll();
    productData = await productService.getAll();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    errorMsg = `Could not load data from server. ${error.message}`;
  }
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;
  return (
    <div>
      <PageBreadcrumb
        pageTitle="Schedule Inventory Check"
        filters={["warehouse-management"]}
      />
      <div className="flex flex-col gap-6">
        <CreateICSheetForm warehouse={warehouseData} product={productData} />
        <ComponentCard title="Assigned Inspector Schedule">
          <Calendar />
        </ComponentCard>
      </div>
    </div>
  );
}
