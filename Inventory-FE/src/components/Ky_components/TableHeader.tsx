import { Column } from "./CustomizableTable";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPen } from "@fortawesome/free-solid-svg-icons";

export const warehouseTableHeader: Column<Object>[] = [
    {
      label: "Code",
      key: "warehouseCode",
    },
    {
      label: "Name",
      key: "warehouseName",
    },
    {
      label: "Type",
      key: "warehouseType",
    },
    {
      label: "Created By",
      key: "createdBy",
    },
    {
      label: "Status",
      key: "status",
    },
    {
      label: "Actions",
      key: "actions",
      render: (data: string[], row: any) => (
        <div className="flex gap-3">
            {data.includes("r") && <Link href={`/warehouse/${row.warehouseCode}`}>
                <FontAwesomeIcon
                icon={faEye}
                className="cursor-pointer hover:text-blue-500"
                />
            </Link>
            }
            {data.includes("w") && <Link href={`/warehouse`}>
                <FontAwesomeIcon
                icon={faPen}
                className="cursor-pointer hover:text-blue-500"
                />
            </Link>
            }
        </div>
      )
    },
];

