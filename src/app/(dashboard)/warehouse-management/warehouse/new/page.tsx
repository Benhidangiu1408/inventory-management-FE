import { CreateWarehouseForm } from "@/components/form/CreateWarehouseForm";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import { User } from "@/interfaces/userManagementType";
import { userManagementService } from "@/services/UserManagementService";

export default async function CreateWarehousePage() {
  let errorMsg = null;
  let data: User[] = [];

  try {
    data = await userManagementService.getAllByPermissionCode("VIEW_WAREHOUSE");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    errorMsg = `Could not load data from server. ${error.message}`;
  }
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;
  return (
    <div>
      <PageBreadcrumb
        pageTitle="Create Warehouse"
        filters={["warehouse-management"]}
      />
      <div className="default-card p-6">
        <CreateWarehouseForm userData={data} />
      </div>
    </div>
  );
}
