import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import { Role, User } from "@/interfaces/userManagementType";
import {
  roleManagementService,
  userManagementService,
} from "@/services/UserManagementService";
import { ClientUserTable } from "@/components/table/ClientTable";
import Link from "next/link";
import Button from "@/default_components/ui/button/Button";
import { Plus } from "lucide-react";

export default async function UserManagementPage() {
  // Handle initial page data
  let data: User[] = [];
  let rolesData: Role[] = [];
  let errorMsg = null;

  try {
    data = await userManagementService.getAll();
    rolesData = await roleManagementService.getAllRole();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    errorMsg = `Could not load data from server. ${error.message}`;
  }
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;
  return (
    <div>
      <PageBreadcrumb pageTitle="User Management" filters={["admin"]} />
      <div className="default-card p-6">
        <div className="mb-6 flex justify-end px-1 pt-2">
          <Link href={`/admin/user-management/new`}>
            <Button size="sm" variant="primary" startIcon={<Plus size={16} />}>
              New Account
            </Button>
          </Link>
        </div>
        <ClientUserTable initialData={data} rolesData={rolesData} />
      </div>
    </div>
  );
}
