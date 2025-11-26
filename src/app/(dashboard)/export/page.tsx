import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import CustomFilter from "@/components/TA_common/CustomFilter";
import FilterItem from "@/components/TA_common/FilterItem";
import List from "@/components/TA_List/List";
import Summary from "@/components/TA_List/Summary";
import {
  faCalendar,
  faFilter,
  faMagnifyingGlass,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ExportPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageBreadcrumb pageTitle="Export Page" />

      <div className="rounded-2xl border">
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
      </div>

      <div>
        <Summary />
      </div>

      <div className="rounded-2xl border">
        <List type="export" />
      </div>
    </div>
  );
}
