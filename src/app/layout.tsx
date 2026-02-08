import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import Navbar from "@/components/Navbar";
import CartBadge from "@/components/nav/CartBadge";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FIT IN",
  description: "Luxury apparel storefront and admin dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-text transition-colors duration-300 font-body antialiased">
        <AppProviders>
          <div className="min-h-screen flex flex-col">
            <Toaster position="top-center" />
            <Navbar cartBadge={<CartBadge />} />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
