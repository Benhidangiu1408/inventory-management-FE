import { Outfit } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import MyToast from "@/components/toast";
import { ReactQueryProvider } from "../context/TanstackQueryContext";
import { cookies } from "next/headers";
import { AuthProvider } from "@/context/AuthContext";
config.autoAddCss = false;

const outfit = Outfit({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId");
  const permissions = cookieStore.get("permissions");

  const initialUser =
    userId?.value && permissions?.value
      ? {
          userId: userId.value,
          permissions: permissions.value.split(","),
        }
      : null;

  return (
    <html lang="en">
      <head>
        <title>WMS - Warehouse Management System</title>
      </head>
      <body className={`${outfit.className} bg-[#f9fafb] dark:bg-gray-900`}>
        <ReactQueryProvider>
          <AuthProvider initialUser={initialUser}>
            <ThemeProvider>
              <SidebarProvider>
                <MyToast />

                {children}
              </SidebarProvider>
            </ThemeProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
