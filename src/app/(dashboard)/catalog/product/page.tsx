import AccordionTable from "@/components/table/AccordionTable";
import {
  productHeaders,
  variantHeaders,
} from "@/components/table/AccordionTableHeader";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import Button from "@/default_components/ui/button/Button";
import { ProductResponse } from "@/interfaces/warehouseManagementType";
import { productService } from "@/services/WarehouseManagementService";
import { Plus } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function ProductPage() {
  let data: ProductResponse[] = [];
  let errorMsg = null;
  const cookieStore = await cookies();
  const permissions = cookieStore.get("permissions")?.value.split(",");

  try {
    data = await productService.getAll();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    errorMsg = `Could not load data from server. ${error.message}`;
  }
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;
  return (
    <div>
      <PageBreadcrumb pageTitle="Product" filters={["catalog"]} />
      <div>
        <div className="default-card p-6">
          {permissions?.includes("EDIT_PRODUCT") && (
            <div className="mb-6 flex justify-end px-1 pt-2">
              <Link href={`/catalog/product/new`}>
                <Button
                  size="sm"
                  variant="primary"
                  startIcon={<Plus size={16} />}
                >
                  New Product
                </Button>
              </Link>
            </div>
          )}
          <AccordionTable
            headers={productHeaders}
            subTableKey={"variants"}
            subTableHeaders={variantHeaders}
            data={data}
          />
        </div>
      </div>
    </div>
  );
}
