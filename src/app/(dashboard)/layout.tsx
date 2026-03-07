import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import Backdrop from "@/components/layout/Backdrop";
import React from "react";
import ClientLayoutWrapper from "./ClientLayoutWrapper";
import { cookies } from "next/headers";
import { userManagementService } from "@/services/UserManagementService";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value || null;
  const userInfo = await userManagementService.getById(userId || "");

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <ClientLayoutWrapper>
        {/* Header */}
        <AppHeader userInfo={userInfo} />
        {/* Page Content */}
        <div className="mx-auto max-w-(--breakpoint-2xl) p-4 md:p-6">
          {children}
        </div>
      </ClientLayoutWrapper>
    </div>
  );
}
