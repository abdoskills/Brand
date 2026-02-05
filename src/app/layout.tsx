import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

export const metadata: Metadata = {
  title: "StreetWear",
  description: "Streetwear e-commerce storefront and admin dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background-dark text-white font-body">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
