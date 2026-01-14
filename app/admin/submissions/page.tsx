import { getSubmissions } from "./actions";
import { SubmissionsTable } from "@/components/admin/submissions";

export default async function SubmissionsPage() {
  const submissions = await getSubmissions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
          Submissões
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Gerencie submissões de setups enviados pela comunidade
        </p>
      </div>

      {/* Table */}
      <SubmissionsTable submissions={submissions} />
    </div>
  );
}
