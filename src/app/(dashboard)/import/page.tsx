import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import CustomFilter from "@/components/TA_common/CustomFilter";
import FilterItem from "@/components/TA_common/FilterItem";
// import Filter from "@/components/TA_List/Filter";
import List from "@/components/TA_List/List";
import Summary from "@/components/TA_List/Summary";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { inboundOutboundService } from "@/services/InboundOutboundService";
import { ImportSheetResponse } from "@/interfaces/inboundOutboundType";
import Button from "@/default_components/ui/button/Button";
import Link from "next/link";
import { cookies } from "next/headers";
import { UserPermissions } from "@/interfaces/userManagementType";

export default async function ImportPage() {
  const importSheetList: ImportSheetResponse[] =
    await inboundOutboundService.getAll();

  const cookieStore = await cookies();
  const permissions = cookieStore.get("permissions");

  const hasStockInPermission = permissions?.value.includes(
    UserPermissions.STOCK_IN,
  );

  return (
    <div className="flex flex-col gap-6">
      <PageBreadcrumb pageTitle="Import Page" />

      {hasStockInPermission && (
        <div className="flex justify-end">
          <Link href="/import/new">
            <Button startIcon={<FontAwesomeIcon icon={faPlus} />}>
              New Import
            </Button>
          </Link>
        </div>
      )}

      {/* <div className="rounded-2xl border bg-white">
        <CustomFilter
          listButton={[
            {
              size: "sm",
              type: "link",
              title: "New Import",
              href: "/import/new",
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
      </div> */}

      <div>
        <Summary />
      </div>

      <div className="rounded-2xl border bg-white">
        <List type="import" data={importSheetList} />
      </div>
    </div>
  );
}
