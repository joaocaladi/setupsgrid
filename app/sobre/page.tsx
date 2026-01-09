import { Header, Footer } from "@/components";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre - SetupsGrid",
  description:
    "Conheça o SetupsGrid. Curamos os melhores setups da internet e organizamos tudo em um só lugar, com links diretos para você comprar.",
};

export default function SobrePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Header />

      <main className="flex-1">
        {/* Back button */}
        <div className="container-wide pt-6 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Link>
        </div>

        {/* Hero Section */}
        <section className="py-12 md:py-16">
          <div className="container-text">
            <h1 className="text-display text-[var(--text-primary)] mb-4">
              Sobre.
            </h1>
            <p className="text-body-large text-[var(--text-secondary)]">
              Seu espaço de trabalho ideal começa com uma inspiração.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="pb-20 md:pb-32">
          <div className="container-text space-y-12">
            {/* Intro */}
            <div className="space-y-4">
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                O SetupsGrid nasceu de uma ideia simples: todo mundo merece um
                setup/workspace que inspire produtividade, criatividade e
                bem-estar.
              </p>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Sabemos que montar o setup perfeito não é fácil. São horas
                navegando em fóruns, vídeos e redes sociais tentando descobrir
                qual mesa, monitor, cadeira ou acessório realmente vale a pena.
                E mesmo quando você encontra aquela foto incrível de um setup,
                fica a pergunta: &quot;onde compro isso?&quot;
              </p>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Foi para resolver esse problema que criamos o SetupsGrid.
              </p>
            </div>

            {/* O que fazemos */}
            <div className="space-y-4">
              <h2 className="text-h2 text-[var(--text-primary)]">
                O que fazemos
              </h2>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Curamos os melhores setups da internet e organizamos tudo em um
                só lugar. Cada setup vem com a lista completa de produtos — com
                links diretos para você comprar.
              </p>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Sem mistério. Sem complicação.
              </p>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Você encontra a inspiração, descobre os produtos e monta o seu
                espaço do seu jeito.
              </p>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Acreditamos que um bom setup vai além da estética. É sobre criar
                um ambiente que funciona para você, que te ajuda a focar, a
                criar e a fazer o seu melhor trabalho.
              </p>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Por isso, não mostramos apenas setups bonitos. Mostramos setups
                reais, de pessoas reais, com produtos que você pode realmente
                comprar no Brasil.
              </p>
            </div>

            {/* Como funciona */}
            <div className="space-y-4">
              <h2 className="text-h2 text-[var(--text-primary)]">
                Como funciona
              </h2>
              <ul className="space-y-3">
                <li className="text-body text-[var(--text-secondary)] leading-relaxed">
                  <span className="text-[var(--text-primary)] font-medium">
                    Explore
                  </span>{" "}
                  — Navegue por centenas de setups organizados por estilo e
                  categoria
                </li>
                <li className="text-body text-[var(--text-secondary)] leading-relaxed">
                  <span className="text-[var(--text-primary)] font-medium">
                    Descubra
                  </span>{" "}
                  — Veja a lista completa de produtos de cada setup
                </li>
                <li className="text-body text-[var(--text-secondary)] leading-relaxed">
                  <span className="text-[var(--text-primary)] font-medium">
                    Monte
                  </span>{" "}
                  — Use os links diretos para comprar e montar o seu próprio
                  setup/workspace
                </li>
              </ul>
            </div>

            {/* Transparência */}
            <div className="space-y-4">
              <h2 className="text-h2 text-[var(--text-primary)]">
                Transparência
              </h2>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Alguns links em nosso site são links de afiliados. Isso
                significa que podemos receber uma pequena comissão quando você
                compra através deles, sem nenhum custo adicional para você.
              </p>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Essa é a forma como mantemos o SetupsGrid funcionando e gratuito
                para todos.
              </p>
            </div>

            {/* Faça parte */}
            <div className="space-y-4">
              <h2 className="text-h2 text-[var(--text-primary)]">Faça parte</h2>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Tem um setup incrível? Compartilhe com a comunidade.
              </p>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Aceitamos submissões de setups de toda a comunidade. Se o seu
                for selecionado, ele será publicado com os devidos créditos e
                poderá inspirar milhares de pessoas.
              </p>
            </div>

            {/* Contato */}
            <div className="space-y-4">
              <h2 className="text-h2 text-[var(--text-primary)]">Contato</h2>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Dúvidas, sugestões ou parcerias?
              </p>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                E-mail:{" "}
                <a
                  href="mailto:contato@setupsgrid.com"
                  className="text-[var(--text-primary)] hover:underline"
                >
                  contato@setupsgrid.com
                </a>
              </p>
            </div>

            {/* Slogan */}
            <div className="pt-8 border-t border-[var(--border)]">
              <p className="text-body-large text-[var(--text-primary)] font-medium">
                SetupsGrid — Inspire. Descubra. Monte.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
