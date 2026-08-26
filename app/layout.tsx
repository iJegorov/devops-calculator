import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "DevOps Calculator",
  description: "A calculator application for the DevOps case study",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
