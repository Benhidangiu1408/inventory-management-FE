"use client";

import {
  LocationResponse,
  LocationType,
} from "@/interfaces/warehouseManagementType";
import CustomizableTable from "./table/CustomizableTable";
import { LocationHeaders } from "./table/CustomizableTableHeader";
import DefaultTab from "./ui-elements/Tabs";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { locationGetByTypeAction } from "@/actions/system-info";
import { ModalCreateLocationForm } from "./form/ModalCreateLocationForm";

const TableFetch = ({
  warehouseId,
  type,
  refreshKey,
}: {
  warehouseId: number;
  type: LocationType;
  refreshKey: number;
}) => {
  const [data, setData] = useState<LocationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect runs ONLY when the tab is first clicked/mounted
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await locationGetByTypeAction(warehouseId, type);
        setData(res);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message ?? "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, warehouseId, refreshKey]);

  return (
    <CustomizableTable
      data={data}
      loading={loading}
      headers={LocationHeaders}
    />
  );
};

export function ViewLocation() {
  const id = Number(useParams().id);
  const locationTypes = [
    LocationType.ROOM,
    LocationType.ZONE,
    LocationType.AISLE,
    LocationType.RACK,
    LocationType.SHELF,
    LocationType.BIN,
  ];
  const [refreshKey, setRefreshKey] = useState(0);
  // Create a function to trigger the refresh
  const handleLocationCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };
  const headers = locationTypes.map((type) => ({
    title: type.charAt(0) + type.slice(1).toLowerCase(),
  }));

  const contents = locationTypes.map((type) => (
    <TableFetch
      key={type}
      warehouseId={id}
      type={type}
      refreshKey={refreshKey}
    />
  ));

  return (
    <div className="default-card flex flex-col gap-6 p-6">
      <ModalCreateLocationForm onSuccess={handleLocationCreated} />
      <div className="flex flex-col gap-6">
        <DefaultTab tabHeaders={headers} tabContents={contents} />
      </div>
    </div>
  );
}
