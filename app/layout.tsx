import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastProvider } from "@/components/shared/toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Invoice Generator",
  description: "Invoice generator web application imported from coderakash26/invoce-generator.",
  openGraph: {
    title: "Invoice Generator",
    description: "Invoice generator web application imported from coderakash26/invoce-generator.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F7F8FC] text-zinc-900">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
