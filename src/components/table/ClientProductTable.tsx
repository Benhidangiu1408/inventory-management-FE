"use client";

import { useState } from "react";
import AccordionTable from "./AccordionTable";
import { getSubVariantHeaders, productHeaders } from "./AccordionTableHeader";
import ViewFullImage from "../ViewFullImage";
import { ProductResponse } from "@/interfaces/warehouseManagementType";

interface Props {
  initialData: ProductResponse[];
}

export function ClientProductTable({ initialData }: Props) {
  const [inspectImageUrl, setInspectImageUrl] = useState<string | null>(null);
  const subHeader = getSubVariantHeaders((url) => setInspectImageUrl(url));

  return (
    <>
      <ViewFullImage
        imageUrl={inspectImageUrl}
        onClose={() => setInspectImageUrl(null)}
        altText="Product Variant"
      />
      <AccordionTable
        headers={productHeaders}
        subTableKey={"variants"}
        subTableHeaders={subHeader}
        data={initialData}
      />
    </>
  );
}
