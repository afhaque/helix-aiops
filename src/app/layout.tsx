import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Helix — People Ops Customer Success",
  description: "Customer health for HR & people-ops platforms. AIOPS Unit 3 demo."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream text-ink antialiased">{children}</body>
    </html>
  );
}
