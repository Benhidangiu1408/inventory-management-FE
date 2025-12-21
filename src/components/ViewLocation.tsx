"use client";

import {
  LocationResponse,
  LocationType,
} from "@/interfaces/warehouseManagementType";
import CustomizableTable from "./table/CustomizableTable";
import { LocationHeaders } from "./table/CustomizableTableHeader";
import DefaultTab from "./ui-elements/Tabs";
import { useEffect, useState } from "react";
import { locationService } from "@/services/WarehouseManagementService";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/api-mask";

const TableFetch = ({
  warehouseId,
  type,
}: {
  warehouseId: number;
  type: LocationType;
}) => {
  const [data, setData] = useState<LocationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect runs ONLY when the tab is first clicked/mounted
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await locationService.getByType(warehouseId, type);
        setData(res);
      } catch (error) {
        if (error instanceof ApiError) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, warehouseId]);

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
  const headers = locationTypes.map((type) => ({
    title: type.charAt(0) + type.slice(1).toLowerCase(),
  }));

  const contents = locationTypes.map((type) => (
    <TableFetch key={type} warehouseId={id} type={type} />
  ));

  return (
    <div className="flex flex-col gap-6">
      <DefaultTab tabHeaders={headers} tabContents={contents} />
    </div>
  );
}
