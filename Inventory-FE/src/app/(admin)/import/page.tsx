import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Filter from "@/components/TA_List/Filter";
import List from "@/components/TA_List/List";
import Summary from "@/components/TA_List/Summary";

export default function ImportPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Import Page" />
      <div>
        <div className="rounded-2xl border border-[#E4E7EC] bg-white">
          <Filter type="import" />
          <Summary />
          <List type="import" />
        </div>
      </div>
    </div>
  );
}
