import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Filter from "@/components/TA_List/Filter";
import List from "@/components/TA_List/List";
import Summary from "@/components/TA_List/Summary";

export default function ExportPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Export Page" />
      <div>
        <div className="rounded-2xl border border-[#E4E7EC] bg-white">
          <Filter type="export" />
          <Summary />
          <List type="export" />
        </div>
      </div>
    </div>
  );
}
