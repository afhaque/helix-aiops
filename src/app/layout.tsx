import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Helix — Customer Health Intelligence",
  description: "Internal customer success operator dashboard. Upload your CS platform export to surface at-risk accounts, renewal exposure, and health trends."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream text-ink antialiased">{children}</body>
    </html>
  );
}
