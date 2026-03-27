import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import { Permission, Role } from "@/interfaces/userManagementType";
import { RoleAssignmentList } from "@/components/RoleAssignmentList";
import { roleManagementService } from "@/services/UserManagementService";

export default async function RoleManagementPage() {
  let rolesData: Role[] = [];
  let permissionsData: Permission[] = [];
  let errorMsg = null;

  try {
    rolesData = await roleManagementService.getAllRole();
    permissionsData = await roleManagementService.getAllPermission();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    errorMsg = `Could not load data from server. ${error.message}`;
  }
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;

  return (
    <div>
      <PageBreadcrumb pageTitle="Role Management" />
      <div className="default-card">
        <RoleAssignmentList
          initialRolesData={rolesData}
          initialPermissionsData={permissionsData}
        />
      </div>
    </div>
  );
}
