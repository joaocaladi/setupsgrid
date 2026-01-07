import Link from "next/link";
import { Instagram, Twitter, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background-secondary)]">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block">
              <h2 className="text-xl font-bold">
                <span className="gradient-text">Setups</span>
                <span className="text-[var(--text-primary)]">Grid</span>
              </h2>
            </Link>
            <p className="mt-3 text-sm text-[var(--text-secondary)] max-w-md">
              Descubra setups incríveis e encontre os produtos perfeitos para
              montar seu workspace dos sonhos. Inspiração para todos os estilos.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-4 mt-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
              Explorar
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/categoria/minimalista"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  Minimalista
                </Link>
              </li>
              <li>
                <Link
                  href="/categoria/gamer"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  Gamer
                </Link>
              </li>
              <li>
                <Link
                  href="/categoria/trabalho"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  Trabalho
                </Link>
              </li>
              <li>
                <Link
                  href="/categoria/moderno"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  Moderno
                </Link>
              </li>
            </ul>
          </div>

          {/* More links */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
              Sobre
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  Contato
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--text-muted)] text-center">
            © {new Date().getFullYear()} SetupsGrid. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
