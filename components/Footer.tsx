import Link from "next/link";

const categorias = [
  { nome: "Minimalista", slug: "minimalista" },
  { nome: "Gamer", slug: "gamer" },
  { nome: "Trabalho", slug: "trabalho" },
  { nome: "Moderno", slug: "moderno" },
];

const links = [
  { nome: "Sobre", href: "/sobre" },
  { nome: "Contato", href: "/contato" },
  { nome: "Privacidade", href: "/privacidade" },
  { nome: "Termos", href: "/termos" },
];

export function Footer() {
  return (
    <footer className="bg-[var(--background-tertiary)] border-t border-[var(--border)]">
      {/* Main footer content */}
      <div className="container-wide py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Explorar */}
          <div>
            <h3 className="text-xs font-semibold text-[var(--text-primary)] mb-4">
              Explorar
            </h3>
            <ul className="space-y-3">
              {categorias.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categoria/${cat.slug}`}
                    className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {cat.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sobre */}
          <div>
            <h3 className="text-xs font-semibold text-[var(--text-primary)] mb-4">
              SetupsGrid
            </h3>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.nome}>
                  <Link
                    href={link.href}
                    className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {link.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Espaço vazio em desktop */}
          <div className="hidden md:block" />
          <div className="hidden md:block" />
        </div>
      </div>

      {/* Bottom bar - Apple style */}
      <div className="border-t border-[var(--border)]">
        <div className="container-wide py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[var(--text-secondary)]">
              Copyright © {new Date().getFullYear()} SetupsGrid. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacidade"
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Privacidade
              </Link>
              <Link
                href="/termos"
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Termos
              </Link>
              <Link
                href="#"
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Mapa do site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
