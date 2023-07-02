import { Metadata } from "next";
import { Toaster } from "~/components/ui/toaster";
import "~/styles/globals.css";

export const metadata: Metadata = {
  title: "Sync Playground",
  description: "Syncing...",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
