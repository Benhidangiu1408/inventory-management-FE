"use client";

import { faChevronDown, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "@/default_components/form/Select";
import Button from "@/default_components/ui/button/Button";
import { useEffect, useState } from "react";
import { Modal } from "@/default_components/ui/modal";
import NewPermissionForm from "@/default_components/new-creation/NewPermissionForm";
import NewRoleForm from "@/default_components/new-creation/NewRoleForm";

export type DateRange = {
  from?: Date;
  to?: Date;
  fromText?: string;
  toText?: string;
};

export type Role = {
  id: number;
  name: string;
};

interface FilterProps {
  type:
    | "import"
    | "export"
    | "warehouse"
    | "product"
    | "category"
    | "inventory-check"
    | "fault order"
    | "user"
    | "permission"
    | "role";
  onDateRangeChange?: (dateRange: DateRange) => void;
  dateRangePlaceholder?: {
    from?: string;
    to?: string;
  };
  roles?: Role[];
  onRoleChange?: (roleId: number) => void;
}

export default function Filter({
  type,
  onDateRangeChange,
  roles,
  onRoleChange,
}: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPermissionOpen, setIsPermissionOpen] = useState(false);

  const renderModalForm = (type: FilterProps["type"]) => {
    switch (type) {
      // case "import":
      //   return <ImportForm />;
      // case "export":
      //   return <ExportForm />;
      // case "warehouse":
      //   return <WarehouseForm />;
      // case "product":
      //   return <ProductForm />;
      // case "category":
      //   return <CategoryForm />;
      // case "inventory-check":
      //   return <InventoryCheckForm />;
      // case "fault order":
      //   return <FaultOrderForm />;
      case "role":
        return <NewRoleForm onClose={() => setIsOpen(false)} />;
      // case "permission":
      //   return <PermissionForm />;
      default:
        return null;
    }
  };

  // const selectList = [
  //   {
  //     title: "Warehouse",
  //     options: [
  //       { value: "1", label: "Option 1" },
  //       { value: "2", label: "Option 2" },
  //       { value: "3", label: "Option 3" },
  //       { value: "4", label: "Option 4" },
  //       { value: "5", label: "Option 5" },
  //     ],
  //   },
  //   {
  //     title: "Suppliers",
  //     options: [
  //       { value: "1", label: "Option 1" },
  //       { value: "2", label: "Option 2" },
  //       { value: "3", label: "Option 3" },
  //       { value: "4", label: "Option 4" },
  //       { value: "5", label: "Option 5" },
  //     ],
  //   },
  //   {
  //     title: "Status",
  //     options: [
  //       { value: "1", label: "Option 1" },
  //       { value: "2", label: "Option 2" },
  //       { value: "3", label: "Option 3" },
  //       { value: "4", label: "Option 4" },
  //       { value: "5", label: "Option 5" },
  //     ],
  //   },
  // ];

  return (
    <div className="flex items-center justify-between gap-20 border-b border-[#E4E7EC] p-6 dark:border-gray-800">
      <div className="flex flex-1 gap-3">
        {type === "role" && (
          <div className="relative flex-1">
            <FontAwesomeIcon
              icon={faChevronDown}
              className="absolute top-1/2 left-4 -translate-y-1/2"
            />
            <Select
              defaultValue={roles![0]?.name}
              onChange={(e) => onRoleChange?.(Number(e.target.value!))}
              className="pl-12"
              options={roles!.map((r) => ({
                value: r.id.toString(),
                label: r.name,
              }))}
            />
          </div>
        )}
      </div>
      {/* <Link href={`/${type}/new`}> */}
      <Button
        size="sm"
        variant="primary"
        startIcon={<FontAwesomeIcon icon={faPlus} />}
        className="capitalize"
        onClick={() => setIsOpen(true)}
      >
        New {type.split(/[-_]/).join(" ")}
      </Button>
      {/* </Link> */}
      {type === "role" && (
        // <Link href={`/${type}/new`}>
        <Button
          size="sm"
          variant="primary"
          startIcon={<FontAwesomeIcon icon={faPlus} />}
          className="capitalize"
          onClick={() => setIsPermissionOpen(true)}
        >
          New permission
        </Button>
        // </Link>
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="m-4 max-w-[700px]"
        overlayClassName="bg-gray-900/10 backdrop-blur-[2px]"
      >
        {renderModalForm(type)}
      </Modal>

      {/* Permission modal */}
      {type === "role" && (
        <Modal
          isOpen={isPermissionOpen}
          onClose={() => setIsPermissionOpen(false)}
          className="m-4 max-w-[700px]"
          overlayClassName="bg-gray-900/10 backdrop-blur-[2px]"
        >
          <NewPermissionForm onClose={() => setIsPermissionOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
