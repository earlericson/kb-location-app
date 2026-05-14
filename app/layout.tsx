import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import { GoogleMapsProvider } from "@/features/providers/google-maps-provider";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Knockerball Locations",
  description: "Manage and monitor your automated mapping system data.",
  icons: {
    icon: "https://firebasestorage.googleapis.com/v0/b/knockerball-map.firebasestorage.app/o/kblocations%2Fkb-logo.webp?alt=media&token=40a9618b-23d0-42d0-8727-c90f11c78b3f",
    apple: "https://firebasestorage.googleapis.com/v0/b/knockerball-map.firebasestorage.app/o/kblocations%2Fkb-logo.webp?alt=media&token=40a9618b-23d0-42d0-8727-c90f11c78b3f",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Everything inside these tags can now use useBusinessMutations */}

        <QueryProvider>
          <GoogleMapsProvider>
            <AuthProvider>
              {children}
              <Toaster position="bottom-center" reverseOrder={false} />
            </AuthProvider>
          </GoogleMapsProvider>
        </QueryProvider>
      </body>
    </html>
  );
}