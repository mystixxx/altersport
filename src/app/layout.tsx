import "@/styles/globals.css";

import { type Metadata } from "next";
import { Montserrat } from "next/font/google";
import { QueryProvider } from "@/providers/QueryProvider";
import UuidManager from "@/components/UuidManager";
import UserInitializer from "@/components/UserInitializer";

export const metadata: Metadata = {
  title: "Altersports",
  description: "Altersports",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${montserrat.variable}`}>
      <body>
        <QueryProvider>
          <UuidManager />
          <UserInitializer />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
