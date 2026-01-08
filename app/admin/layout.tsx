import { Toaster } from "sonner";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { verifySession } from "@/lib/auth";

export const metadata = {
  title: "Admin - SetupsGrid",
  description: "Painel de administração do SetupsGrid",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();

  return (
    <div className="bg-[#f5f5f7] min-h-screen">
      {session && <AdminHeader />}
      <main className={session ? "max-w-7xl mx-auto px-6 py-8" : ""}>
        {children}
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1d1d1f",
            color: "#fff",
            borderRadius: "12px",
          },
        }}
      />
    </div>
  );
}
