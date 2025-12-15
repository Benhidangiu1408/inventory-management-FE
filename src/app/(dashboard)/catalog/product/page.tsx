import AccordionTable from "@/components/table/AccordionTable";
import {
  productHeaders,
  variantHeaders,
} from "@/components/table/AccordionTableHeader";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import Button from "@/default_components/ui/button/Button";
import { ProductResponse } from "@/interfaces/warehouseManagementType";
import { ApiError } from "@/lib/api-mask";
import { productService } from "@/services/WarehouseManagementService";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function ProductPage() {
  let data: ProductResponse[] = [];
  let errorMsg = null;

  try {
    data = await productService.getAll();
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`API Error ${error.status}: ${error.message}`);
      errorMsg = `Could not load data from server.\nError Code: ${error.status}\nMessage: ${error.message}`;
    }
  }
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;
  return (
    <div>
      <PageBreadcrumb pageTitle="Product" filters={["catalog"]} />
      <div>
        <div className="default-card p-6">
          <div className="mb-6 pt-2 px-1 flex justify-end">
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
