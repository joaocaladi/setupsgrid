import { getGruposWithCategorias } from "@/lib/data";
import { HeaderClient } from "./HeaderClient";

interface HeaderWrapperProps {
  categoriaAtiva?: string;
}

export async function HeaderWrapper({ categoriaAtiva }: HeaderWrapperProps) {
  const grupos = await getGruposWithCategorias();

  return <HeaderClient categoriaAtiva={categoriaAtiva} grupos={grupos} />;
}
