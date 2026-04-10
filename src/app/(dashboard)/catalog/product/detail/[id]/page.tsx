import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import GeneralInfoSection from "@/components/GeneralInformation";
import {
  categoryService,
  productService,
  unitService,
} from "@/services/WarehouseManagementService";
import {
  Category,
  ProductResponse,
  UnitConversionResponse,
  UnitResponse,
  UnitSummary,
} from "@/interfaces/warehouseManagementType";
import { ModalProductUpdateForm } from "@/components/form/ModalProductUpdateForm";
import UnitConversionManager from "@/components/UnitConversionManager";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  let data: ProductResponse | null = null;
  let categoryData: Category[] = [];
  let unitData: UnitResponse[] = [];
  let errorMsg = null;

  try {
    data = await productService.getById(Number(id));
    categoryData = await categoryService.getAll();
    unitData = await unitService.getAll();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    errorMsg = `Could not load data from server. ${error.message}`;
  }
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;

  console.log(data);

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
            <ModalProductUpdateForm
              categoryData={categoryData}
              initialData={data as ProductResponse}
            />
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
