import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Software Synthesis OS",
  description: "Intent -> workflow graph -> compiled app surface"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
