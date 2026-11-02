import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fyns Veteranknallert Klub",
  description: "Fyns Veteranknallert Klub - Stiftet 1984",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da">
      <body className="bg-white text-gray-900">
        <header className="bg-yellow-400 border-b-4 border-red-600">
          <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/logo.jpg" alt="Fyns Veteranknallert Klub logo" className="h-20 w-auto" />
              <div>
                <h1 className="text-2xl font-bold">Fyns Veteranknallert Klub</h1>
                <p className="text-sm">Stiftet 1984</p>
              </div>
            </div>
            <nav className="space-x-4">
              <a href="/" className="hover:underline">Hjem</a>
              <a href="/events" className="hover:underline">Arrangementer</a>
              <a href="/about" className="hover:underline">Om klubben</a>
              <a href="/admin" className="hover:underline">Admin</a>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <footer className="bg-gray-100 border-t mt-12 py-6 text-center text-sm">
          <p>Fyns Veteranknallert Klub · WWW.123FVKK.DK</p>
          <p className="mt-1">Facebook: <a href="https://www.facebook.com/123fvkk" className="underline">Fyns Veteranknallert klub</a></p>
        </footer>
      </body>
    </html>
  );
}
