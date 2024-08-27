import "./globals.css";
import DashboardNav from "@/app/UiComponents/Navigation/Navbar/Navbar";
import { Rtl } from "@/app/components/Rtl/Rtl";
import { SubmitLoaderProvider } from "@/app/context/SubmitLoaderProvider/SubmitLoaderProvider";
import { DataLoaderProvider } from "@/app/context/DataLoaderProvider/DataLoaderProvider";
import ToastProvider from "@/app/context/ToastLoading/ToastLoadingProvider";
import { Cairo } from "next/font/google";
import AuthProvider from "@/app/context/AuthProvider/AuthProvider";

export const metadata = {
  title: "",
  description: "",
};
const font = Cairo({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="rtl">
      <body className={font.className}>
        <ToastProvider>
          <AuthProvider>
            <DataLoaderProvider>
              <SubmitLoaderProvider>
                <Rtl>
                  <DashboardNav>{children}</DashboardNav>
                </Rtl>
              </SubmitLoaderProvider>
            </DataLoaderProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
