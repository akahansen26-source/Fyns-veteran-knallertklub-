import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Fyns Veteranknallert Klub",
    template: "%s · Fyns Veteranknallert Klub",
  },
  description: "Fyns Veteranknallert Klub – stiftet 1984. Klubaftener, løb og stumpemarkeder for veteranknallerter på Fyn.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <body>{children}</body>
    </html>
  );
}
