import { CreateWarehouseForm } from "@/components/form/CreateWarehouseForm";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
// import { User } from "@/interfaces/userManagementType";
// import { ApiError } from "@/lib/api-mask";
// import { userManagementService } from "@/services/UserManagementService";

export default function CreateWarehousePage() {
  // let errorMsg = null;

  // try {
  //   data = await userManagementService.getAll(1);
  // } catch (error) {
  //   if (error instanceof ApiError) {
  //     console.error(`API Error ${error.status}: ${error.message}`);
  //     errorMsg = `Could not load data from server.\nError Code: ${error.status}\nMessage: ${error.message}`;
  //   }
  // }
  // if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;
  return (
    <div>
      <PageBreadcrumb
        pageTitle="Create Warehouse"
        filters={["warehouse-management"]}
      />
      <div className="default-card p-6">
        <CreateWarehouseForm />
      </div>
    </div>
  );
}
