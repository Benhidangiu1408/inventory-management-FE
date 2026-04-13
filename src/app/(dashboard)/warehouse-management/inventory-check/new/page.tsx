import { CreateICSheetForm } from "@/components/form/CreateICSheetForm";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import { User } from "@/interfaces/userManagementType";
import {
  ProductResponse,
  WarehouseGeneral,
} from "@/interfaces/warehouseManagementType";
import { userManagementService } from "@/services/UserManagementService";
import {
  productService,
  warehouseService,
} from "@/services/WarehouseManagementService";
import { cookies } from "next/headers";

export default async function CreateICPage() {
  let warehouseData: WarehouseGeneral[] = [];
  let productData: ProductResponse[] = [];
  let userData: User[] = [];
  const cookieStore = await cookies();
  const userId = Number((await cookieStore.get("userId"))?.value);
  let errorMsg = null;

  try {
    warehouseData = await warehouseService.getAll();
    productData = await productService.getAll();
    userData = await userManagementService.getAll();
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
        <CreateICSheetForm
          warehouse={warehouseData}
          product={productData}
          user={userData}
          creator={userId}
        />
        {/* <ComponentCard title="Assigned Inspector Schedule">
          <Calendar />
        </ComponentCard> */}
      </div>
    </div>
  );
}
