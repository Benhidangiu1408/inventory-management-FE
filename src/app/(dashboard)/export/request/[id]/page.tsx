"use client";

import { use } from "react";
import PageBreadcrumb from "@/default_components/common/PageBreadCrumb";
import TableBox from "@/components/TA_common/TableBox";
import GeneralInfoSection from "@/components/GeneralInformation";
import { Column, TableProps } from "@/components/table/CustomizableTable";
import Button from "@/default_components/ui/button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileInvoice } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

interface ThirdPartyRequestProductRow {
  productName: string;
  quantity: number;
  unit: string;
}

export default function ThirdPartyExportRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  // Sample data - in real app, this would come from API
  const requestId = id;
  const thirdPartyInfo = {
    name: "XYZ Customer Company",
    contact: "contact@xyzcustomer.com",
    phone: "+84 987 654 321",
    address: "456 Customer Street, Ho Chi Minh City",
  };

  const productData: ThirdPartyRequestProductRow[] = [
    {
      productName: "Product X",
      quantity: 30,
      unit: "pcs",
    },
    {
      productName: "Product Y",
      quantity: 50,
      unit: "boxes",
    },
    {
      productName: "Product Z",
      quantity: 20,
      unit: "units",
    },
    {
      productName: "Product W",
      quantity: 40,
      unit: "pcs",
    },
  ];

  const productColumns: Column<ThirdPartyRequestProductRow>[] = [
    {
      key: "productName",
      label: "Product Name",
    },
    {
      key: "quantity",
      label: "Quantity",
    },
    {
      key: "unit",
      label: "Unit",
    },
  ];

  const productTableProps: TableProps<ThirdPartyRequestProductRow> = {
    headers: productColumns,
    data: productData,
  };

  const generalInfoItems = [
    {
      label: "Request ID",
      value: requestId,
    },
    {
      label: "Third Party Name",
      value: thirdPartyInfo.name,
    },
    {
      label: "Contact Email",
      value: thirdPartyInfo.contact,
    },
    {
      label: "Phone",
      value: thirdPartyInfo.phone,
    },
    {
      label: "Address",
      value: thirdPartyInfo.address,
    },
    {
      label: "Total Products",
      value: productData.length.toString(),
    },
    {
      label: "Total Quantity",
      value: productData.reduce((sum, p) => sum + p.quantity, 0).toString(),
    },
  ];

  const handleCreateExportTicket = () => {
    // Navigate to process page with customer type (default for export requests)
    // In real app, you might need to create the export ticket first via API
    router.push(`/export/process/customer/${requestId}/confirm`);
  };

  return (
    <div>
      <PageBreadcrumb
        pageTitle="Third Party Export Request"
        filters={["request", requestId]}
      />
      <div className="flex flex-col gap-6">
        <div className="default-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Request Details</h2>
            <Button
              variant="primary"
              startIcon={<FontAwesomeIcon icon={faFileInvoice} />}
              onClick={handleCreateExportTicket}
            >
              Create Export Sheet
            </Button>
          </div>
          <GeneralInfoSection
            title="Third Party Information"
            items={generalInfoItems}
          />
        </div>

        <TableBox<ThirdPartyRequestProductRow>
          title="Product List"
          table={productTableProps}
        />
      </div>
    </div>
  );
}
