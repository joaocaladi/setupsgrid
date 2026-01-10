import { Toaster } from "sonner";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { verifySession } from "@/lib/auth";

export const metadata = {
  title: "Admin - Gridiz",
  description: "Painel de administração do Gridiz",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();

  return (
    <div className="bg-[var(--background)] min-h-screen">
      {session && <AdminHeader />}
      <main className={session ? "max-w-7xl mx-auto px-6 py-8" : ""}>
        {children}
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--background-secondary)",
            color: "var(--text-primary)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
          },
        }}
      />
    </div>
  );
}
