import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import GeneralInfoSection from "@/components/GeneralInformation";
import { warehouseService } from "@/services/WarehouseManagementService";
import { WarehouseDetail } from "@/interfaces/warehouseManagementType";
import { ModalUpdateWarehouseForm } from "@/components/form/ModalUpdateWarehouseForm";
import { ViewLocation } from "@/components/ViewLocation";

export default async function WarehouseDetailPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  let data: WarehouseDetail | null = null;
  let errorMsg = null;

  try {
    data = await warehouseService.getDetail(Number(id));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    errorMsg = `Could not load data from server. ${error.message}`;
  }
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;

  const generalInfoItems = [
    { label: "Code", value: data?.code },
    { label: "Warehouse Name", value: data?.name },
    { label: "Address", value: data?.address },
    { label: "Manager", value: data?.managerName },
    { label: "Status", value: data?.status },
    { label: "Type", value: data?.type },
  ];
  return (
    <div>
      <PageBreadcrumb
        pageTitle="Warehouse Detail"
        filters={["warehouse-management", "detail"]}
      />
      <div className="flex flex-col gap-6">
        <GeneralInfoSection
          title="General Information"
          items={generalInfoItems}
          editBtn={
            <ModalUpdateWarehouseForm initialData={data as WarehouseDetail} />
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
        <ViewLocation />
      </div>
    </div>
  );
}
