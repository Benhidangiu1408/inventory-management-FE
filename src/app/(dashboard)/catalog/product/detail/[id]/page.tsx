import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import GeneralInfoSection from "@/components/GeneralInformation";
import {
  attributesService,
  categoryService,
  productService,
  unitService,
} from "@/services/WarehouseManagementService";
import {
  AttributeResponse,
  Category,
  ProductResponse,
  UnitConversionResponse,
  UnitResponse,
  UnitSummary,
  VariantResponse,
} from "@/interfaces/warehouseManagementType";
import { ModalProductUpdateForm } from "@/components/form/ModalProductUpdateForm";
import UnitConversionManager from "@/components/UnitConversionManager";
import { VariantManager } from "@/components/VariantManager";
import { cookies } from "next/headers";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  let data: ProductResponse | null = null;
  let categoryData: Category[] = [];
  let unitData: UnitResponse[] = [];
  let attributeData: AttributeResponse[] = [];
  let errorMsg = null;
  const cookieStore = await cookies();
  const permissions = cookieStore.get("permissions")?.value.split(",");

  try {
    data = await productService.getById(Number(id));
    categoryData = await categoryService.getAll();
    unitData = await unitService.getAll();
    attributeData = await attributesService.getAll();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    errorMsg = `Could not load data from server. ${error.message}`;
  }
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;

  const generalInfoItems = [
    { label: "Code", value: data?.code },
    { label: "Product Name", value: data?.name },
    { label: "Category", value: data?.categoryName },
  ];
  return (
    <div>
      <PageBreadcrumb
        pageTitle="Product Detail"
        filters={["catalog", "detail"]}
      />
      <div className="flex flex-col gap-6">
        <GeneralInfoSection
          title="General Information"
          items={generalInfoItems}
          editBtn={
            permissions?.includes("EDIT_PRODUCT") ? (
              <ModalProductUpdateForm
                categoryData={categoryData}
                initialData={data as ProductResponse}
              />
            ) : (
              <div></div>
            )
          }
        />
        <GeneralInfoSection
          title="Description"
          items={[
            {
              label: "",
              value: (data?.description as string) || (
                <div className="text-gray-400 italic">No description</div>
              ),
            },
          ]}
        />
        <VariantManager
          availableAttributes={attributeData}
          productId={id}
          data={data?.variants as VariantResponse[]}
        />
        <UnitConversionManager
          productId={id}
          availableUnits={unitData}
          baseUnit={data?.baseUnit as UnitSummary}
          existingConversions={
            data?.unitConversions as UnitConversionResponse[]
          }
        />
      </div>
    </div>
  );
}
