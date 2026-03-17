"use client";

import CustomizableTable from "@/components/table/CustomizableTable";
import { userHeaders } from "@/components/table/CustomizableTableHeader";
import { Role, User } from "@/interfaces/userManagementType";
import { useState } from "react";

interface Props {
  initialData: User[];
  rolesData: Role[];
}

export function ClientUserTable({ initialData, rolesData }: Props) {
  const [tableData, setTableData] = useState<User[]>(initialData);
  const handleRoleUpdate = (userId: number, newRoleName: string) => {
    setTableData((prevData) =>
      prevData.map((user) =>
        user.id === userId ? { ...user, role: newRoleName } : user,
      ),
    );
  };

  return (
    <CustomizableTable
      headers={userHeaders(rolesData, handleRoleUpdate)}
      data={tableData}
    />
  );
}
