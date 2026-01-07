import { SetupCard } from "./SetupCard";
import type { SetupWithRelations } from "@/types";

interface SetupGridProps {
  setups: SetupWithRelations[];
}

export function SetupGrid({ setups }: SetupGridProps) {
  if (setups.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--text-secondary)]">
          Nenhum setup encontrado.
        </p>
      </div>
    );
  }

  return (
    <div className="masonry-grid">
      {setups.map((setup, index) => (
        <SetupCard key={setup.id} setup={setup} index={index} />
      ))}
    </div>
  );
}
