import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CustomFilter from "@/components/TA_common/CustomFilter";
import FilterItem from "@/components/TA_common/FilterItem";
import List from "@/components/TA_List/List";
import Summary from "@/components/TA_List/Summary";
import { faCalendar, faFilter, faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ExportPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Export Page" />
      <div>
        <div className="rounded-2xl border border-[#E4E7EC] bg-white">
           <CustomFilter
            listButton={[
              {
                size: "sm",
                type: "link",
                title: "New Export",
                href: "/export/create",
                startIcon: <FontAwesomeIcon icon={faPlus} />,
              },
            ]}
          >
            <FilterItem
              type="input"
              label="Search"
              placeholder="Search"
              icon={faMagnifyingGlass}
            />
            <FilterItem
              type="select"
              label="Status"
              placeholder="Status"
              icon={faFilter}
              options={[{ label: "Active", value: "active" }]}
            />
            <FilterItem
              type="select"
              label="Status"
              placeholder="Status"
              icon={faFilter}
              options={[{ label: "Active", value: "active" }]}
            />
            <FilterItem
              type="select"
              label="Status"
              placeholder="Status"
              icon={faFilter}
              options={[{ label: "Active", value: "active" }]}
            />
            <FilterItem
              type="date"
              label="Date"
              placeholder="Date"
              icon={faCalendar}
            />
          </CustomFilter>
          <Summary />
          <List type="export" />
        </div>
      </div>
    </div>
  );
}
