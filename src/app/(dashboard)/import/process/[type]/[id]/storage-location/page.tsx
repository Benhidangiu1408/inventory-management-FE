"use client";

import Input from "@/default_components/form/input/InputField";
import Select from "@/default_components/form/Select";
import CustomizableTable, {
  Column,
} from "@/components/table/CustomizableTable";
import InfoBox from "@/default_components/TA_create_page/InfoBox";
import { StorageLocationCheckRow } from "@/interfaces/interface.table";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faBoxOpen,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Title = ({
  icon,
  title,
  quantity,
}: {
  icon: IconProp;
  title: string;
  quantity: number;
}) => {
  return (
    <div className="mb-4 flex items-center gap-3">
      <FontAwesomeIcon icon={icon} />
      <h3>{title}</h3>
      <div className="rounded-lg bg-gray-300 p-1 text-sm">{quantity} items</div>
    </div>
  );
};

export default function StorageLocationPage() {
  const storageLocationColumn: Column<StorageLocationCheckRow>[] = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "quantity",
      label: "Quantity",
    },
    {
      key: "storageLocation",
      label: "Storage Location",
      render: () => <Select options={[]} onChange={() => {}} />,
    },
    {
      key: "notes",
      label: "Notes",
      render: () => <Input />,
    },
  ];

  const storageLocationData: StorageLocationCheckRow[] = [
    {
      name: "Product 1",
      quantity: 10,
      storageLocation: "Storage Location 1",
      notes: "Notes 1",
    },
    {
      name: "Product 2",
      quantity: 20,
      storageLocation: "Storage Location 2",
      notes: "Notes 2",
    },
  ];

  const storageDefectiveLocationData: StorageLocationCheckRow[] = [
    {
      name: "Product 1",
      quantity: 10,
      storageLocation: "Storage Location 1",
      notes: "Notes 1",
    },
    {
      name: "Product 2",
      quantity: 20,
      storageLocation: "Storage Location 2",
      notes: "Notes 2",
    },
  ];

  return (
    <InfoBox
      icon={<FontAwesomeIcon icon={faBoxOpen} />}
      title="Storage Location"
    >
      <div className="flex flex-col gap-6 p-6">
        <div>
          <Title
            icon={faCircleCheck}
            title="Passed Products"
            quantity={storageLocationData.length}
          />
          <CustomizableTable<StorageLocationCheckRow>
            headers={storageLocationColumn}
            data={storageLocationData}
          />
        </div>
        <div>
          <Title
            icon={faCircleXmark}
            title="Failed Products"
            quantity={storageLocationData.length}
          />
          <CustomizableTable<StorageLocationCheckRow>
            headers={storageLocationColumn}
            data={storageDefectiveLocationData}
          />
        </div>
      </div>
    </InfoBox>
  );
}
