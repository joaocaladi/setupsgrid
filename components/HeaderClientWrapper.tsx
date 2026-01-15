"use client";

import { HeaderClient } from "./HeaderClient";
import type { Profile } from "@prisma/client";

interface Categoria {
  id: string;
  nome: string;
  slug: string;
  _count?: {
    setups: number;
  };
}

interface GrupoCategoria {
  id: string;
  nome: string;
  slug: string;
  categorias: Categoria[];
}

interface HeaderClientWrapperProps {
  categoriaAtiva?: string;
  grupos?: GrupoCategoria[];
  profile?: Profile | null;
}

export function HeaderClientWrapper({
  categoriaAtiva,
  grupos = [],
  profile = null,
}: HeaderClientWrapperProps) {
  return (
    <HeaderClient
      categoriaAtiva={categoriaAtiva}
      grupos={grupos}
      profile={profile}
    />
  );
}
