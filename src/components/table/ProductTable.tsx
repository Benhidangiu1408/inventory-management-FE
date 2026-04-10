"use client";

import { useCallback, useMemo, useState } from "react";
import AccordionTable from "./AccordionTable";
import { ProductResponse } from "@/interfaces/warehouseManagementType";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import {
  ProductDeleteAction,
  VariantDeleteAction,
} from "@/actions/system-info";

export function ProductTable({ data }: { data: ProductResponse[] }) {
  const router = useRouter();
  const { confirm, ConfirmationModal } = useConfirmModal();
  const [disable, setDisable] = useState(false);
  const handleDeleteProduct = useCallback(
    async (id: number) => {
      console.log(id);
      const isConfirmed = await confirm({
        title: "Delete Product",
        message: "Are you sure you want to delete this product?",
      });
      if (!isConfirmed) return;
      try {
        setDisable(true);
        await ProductDeleteAction(id);
        toast.success("Product deleted successfully!");
        router.refresh();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message ?? "An unexpected error occurred");
      } finally {
        setDisable(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router],
  );
  const handleDeleteVariant = useCallback(
    async (id: number) => {
      console.log(id);
      const isConfirmed = await confirm({
        title: "Delete Product Variant",
        message: "Are you sure you want to delete this product variant?",
      });
      if (!isConfirmed) return;
      try {
        setDisable(true);
        await VariantDeleteAction(id);
        toast.success("Product variant deleted successfully!");
        router.refresh();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message ?? "An unexpected error occurred");
      } finally {
        setDisable(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router],
  );

  // const headers = useMemo(
  //   () => getProductHeaders(handleDeleteProduct, disable),
  //   [handleDeleteProduct, disable],
  // );
  // const subheaders = useMemo(
  //   () => getVariantHeaders(() => {}, handleDeleteVariant, disable),
  //   [handleDeleteVariant, disable],
  // );

  return (
    <div>
      {/* {ConfirmationModal}
      <AccordionTable
        headers={headers}
        subTableKey={"variants"}
        subTableHeaders={subheaders}
        data={data}
        getRowId={(params) => String(params.data.id)}
        subTableGetRowId={(params) => String(params.data.id)}
      /> */}
    </div>
  );
}
