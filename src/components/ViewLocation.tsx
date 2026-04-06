"use client";

import {
  LocationResponse,
  LocationType,
} from "@/interfaces/warehouseManagementType";
import CustomizableTable, { Column } from "./table/CustomizableTable";
import { getLocationHeaders } from "./table/CustomizableTableHeader";
import DefaultTab from "./ui-elements/Tabs";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  locationDeleteAction,
  locationGetByTypeAction,
  warehouseDeleteAction,
} from "@/actions/system-info";
import { ModalCreateLocationForm } from "./form/ModalCreateLocationForm";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import Button from "@/default_components/ui/button/Button";
import { Trash } from "lucide-react";

const TableFetch = ({
  warehouseId,
  type,
  refreshKey,
  LocationHeaders,
}: {
  warehouseId: number;
  type: LocationType;
  refreshKey: number;
  LocationHeaders: Column<LocationResponse>[];
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
  const router = useRouter();
  const locationTypes = [
    LocationType.ROOM,
    LocationType.ZONE,
    LocationType.AISLE,
    LocationType.RACK,
    LocationType.SHELF,
    LocationType.BIN,
  ];
  const { confirm, ConfirmationModal } = useConfirmModal();
  const [refreshKey, setRefreshKey] = useState(0);
  // Create a function to trigger the refresh
  const handleLocationCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };
  const [disable, setDisable] = useState(false);
  const handleDeleteWarehouse = async () => {
    setDisable(true);
    try {
      const isConfirmed = await confirm({
        title: "Delete this warehouse?",
        message: "Are you sure you want to delete this warehouse?",
      });
      if (!isConfirmed) return;
      await warehouseDeleteAction(id);
      router.replace("/warehouse-management/warehouse");
      toast.success("Delete Successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message ?? "An unexpected error occurred");
    } finally {
      setDisable(false);
    }
  };
  const locationHeaders = getLocationHeaders(async (id) => {
    setDisable(true);
    try {
      const isConfirmed = await confirm({
        title: "Delete this location?",
        message:
          "Are you sure you want to delete this location? All child locations will also be delete!",
      });
      if (!isConfirmed) return;
      await locationDeleteAction(id);
      toast.success("Delete Successfully!");
      setRefreshKey((prev) => prev + 1);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message ?? "An unexpected error occurred");
    } finally {
      setDisable(false);
    }
  }, disable);
  const headers = locationTypes.map((type) => ({
    title: type.charAt(0) + type.slice(1).toLowerCase(),
  }));

  const contents = locationTypes.map((type) => (
    <TableFetch
      key={type}
      warehouseId={id}
      type={type}
      refreshKey={refreshKey}
      LocationHeaders={locationHeaders}
    />
  ));

  return (
    <div className="default-card flex flex-col gap-6 p-6">
      {ConfirmationModal}
      <div className="flex gap-4">
        <ModalCreateLocationForm onSuccess={handleLocationCreated} />
        <Button
          size="sm"
          variant="danger"
          disabled={disable}
          onClick={handleDeleteWarehouse}
        >
          <Trash size={16} /> Delete Warehouse
        </Button>
      </div>
      <div className="flex flex-col gap-6">
        <DefaultTab tabHeaders={headers} tabContents={contents} />
      </div>
    </div>
  );
}
