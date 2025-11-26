import { CreateWarehouseForm } from "@/components/form/CreateWarehouseForm";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";

export default function CreateWarehousePage() {
  return (
    <div>
      <PageBreadcrumb
        pageTitle="Create Warehouse"
        filters={["warehouse-management"]}
      />
      <div>
        <div className="default-card p-6">
          <CreateWarehouseForm />
        </div>
      </div>
    </div>
  );
}
