import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false } };

const NAV = [
  { href: "/admin", label: "Oversigt" },
  { href: "/admin/arrangementer", label: "Arrangementer" },
  { href: "/admin/nyheder", label: "Nyheder" },
  { href: "/admin/sider", label: "Sider" },
  { href: "/admin/galleri", label: "Billeder & galleri" },
  { href: "/admin/indstillinger", label: "Indstillinger & logo" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="admin">
      <aside className="admin-side">
        <Link href="/admin" className="admin-brand">
          <img src="/logo.png" alt="" />
          <span>Admin</span>
        </Link>
        <nav>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="admin-side-bottom">
          <a href="/" target="_blank" rel="noopener">Se hjemmesiden ↗</a>
          <form action={logout}>
            <button className="linklike">Log ud</button>
          </form>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
