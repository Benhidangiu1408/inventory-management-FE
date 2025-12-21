import { Outfit } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import MyToast from "@/components/toast";
import { ReactQueryProvider } from "./providers";
import AuthGuard from "@/components/layout/AuthGuard";
config.autoAddCss = false;

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <title>WMS - Warehouse Management System</title>
      </head>
      <body className={`${outfit.className} bg-[#f9fafb] dark:bg-gray-900`}>
        <ReactQueryProvider>
          <ThemeProvider>
            <SidebarProvider>
              <MyToast />
              <AuthGuard>{children}</AuthGuard>
            </SidebarProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
