import { Poppins } from "next/font/google";
import { SITE_URL } from "@/lib/config";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Support Page", template: "%s | Support Page" },
  description: "Satu halaman untuk menerima dukungan dari siapa saja.",
  openGraph: { type: "website", siteName: "Support Page", locale: "id_ID" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FBFCFF",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
