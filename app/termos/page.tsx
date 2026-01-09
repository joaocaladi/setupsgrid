import { Header, Footer } from "@/components";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso - SetupsGrid",
  description:
    "Leia os Termos de Uso do SetupsGrid. Informações sobre uso da plataforma, direitos e responsabilidades.",
};

export default function TermosPage() {
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
              Termos de Uso.
            </h1>
            <p className="text-body-large text-[var(--text-secondary)]">
              Ultima atualizacao: Janeiro de 2025
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="pb-20 md:pb-32">
          <div className="container-text space-y-12">
            {/* Intro */}
            <div className="space-y-4">
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Bem-vindo ao SetupsGrid! Estes Termos de Uso (&quot;Termos&quot;)
                regem o acesso e uso do site setupsgrid.com (&quot;Plataforma&quot;,
                &quot;Site&quot; ou &quot;SetupsGrid&quot;), operado por Anma
                (&quot;nos&quot;, &quot;nosso&quot; ou &quot;Empresa&quot;).
              </p>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Ao acessar ou utilizar o SetupsGrid, voce concorda em cumprir e
                estar vinculado a estes Termos. Se voce nao concordar com qualquer
                parte destes Termos, nao devera acessar ou utilizar a Plataforma.
              </p>
            </div>

            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="text-h2 text-[var(--text-primary)]">
                1. Descricao do Servico
              </h2>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                O SetupsGrid e uma plataforma online de inspiracao e curadoria de
                workspaces e setups, que oferece:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body text-[var(--text-secondary)]">
                <li>Galeria de imagens e fotos de setups e estacoes de trabalho</li>
                <li>Listas de produtos utilizados em cada setup</li>
                <li>Links para aquisicao de produtos</li>
                <li>
                  Conteudo educativo e inspiracional sobre organizacao de ambientes
                  de trabalho
                </li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h2 className="text-h2 text-[var(--text-primary)]">
                2. Aceitacao dos Termos
              </h2>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Ao utilizar o SetupsGrid, voce declara que:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body text-[var(--text-secondary)]">
                <li>
                  Tem pelo menos 18 anos de idade ou possui autorizacao de um
                  responsavel legal
                </li>
                <li>Possui capacidade legal para celebrar contratos vinculativos</li>
                <li>
                  Nao esta impedido de utilizar este servico conforme as leis
                  aplicaveis
                </li>
                <li>
                  Leu, compreendeu e concorda com estes Termos e nossa Politica de
                  Privacidade
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="space-y-6">
              <h2 className="text-h2 text-[var(--text-primary)]">
                3. Cadastro e Conta de Usuario
              </h2>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  3.1. Criacao de Conta
                </h3>
                <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                  Para acessar determinadas funcionalidades da Plataforma, pode ser
                  necessario criar uma conta. Ao criar uma conta, voce concorda em:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body text-[var(--text-secondary)]">
                  <li>Fornecer informacoes verdadeiras, precisas e completas</li>
                  <li>Manter suas informacoes de cadastro atualizadas</li>
                  <li>
                    Manter a confidencialidade de sua senha e credenciais de acesso
                  </li>
                  <li>
                    Ser responsavel por todas as atividades realizadas em sua conta
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  3.2. Seguranca da Conta
                </h3>
                <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                  Voce e integralmente responsavel pela seguranca de sua conta.
                  Notifique-nos imediatamente caso suspeite de qualquer uso nao
                  autorizado de sua conta ou violacao de seguranca.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="space-y-6">
              <h2 className="text-h2 text-[var(--text-primary)]">
                4. Conteudo da Plataforma
              </h2>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  4.1. Propriedade do Conteudo
                </h3>
                <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                  Todo o conteudo disponibilizado na Plataforma, incluindo textos,
                  imagens, graficos, logotipos, icones, fotografias, compilacoes de
                  dados e software, e de propriedade do SetupsGrid ou de seus
                  licenciadores e esta protegido pelas leis brasileiras e
                  internacionais de propriedade intelectual.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  4.2. Uso Permitido
                </h3>
                <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                  Voce pode acessar e visualizar o conteudo da Plataforma para uso
                  pessoal e nao comercial. E expressamente proibido:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body text-[var(--text-secondary)]">
                  <li>
                    Copiar, reproduzir, distribuir ou criar obras derivadas do
                    conteudo sem autorizacao
                  </li>
                  <li>
                    Utilizar o conteudo para fins comerciais sem consentimento
                    previo por escrito
                  </li>
                  <li>
                    Remover ou alterar avisos de direitos autorais ou marcas
                    registradas
                  </li>
                  <li>
                    Utilizar tecnicas de scraping, data mining ou extracao
                    automatizada de dados
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  4.3. Conteudo de Terceiros
                </h3>
                <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                  A Plataforma pode exibir conteudo de terceiros, incluindo imagens
                  de setups enviadas por usuarios e informacoes de produtos. Nao nos
                  responsabilizamos pela precisao, integridade ou qualidade deste
                  conteudo.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div className="space-y-6">
              <h2 className="text-h2 text-[var(--text-primary)]">
                5. Conteudo Enviado pelo Usuario
              </h2>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  5.1. Submissao de Conteudo
                </h3>
                <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                  Ao enviar, publicar ou compartilhar qualquer conteudo na
                  Plataforma (incluindo fotos de setups, descricoes e listas de
                  produtos), voce:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body text-[var(--text-secondary)]">
                  <li>
                    Declara ser o proprietario ou possuir as licencas necessarias
                    para tal conteudo
                  </li>
                  <li>
                    Concede ao SetupsGrid uma licenca mundial, nao exclusiva,
                    gratuita, sublicenciavel e transferivel para usar, reproduzir,
                    modificar, adaptar, publicar, traduzir, distribuir e exibir tal
                    conteudo
                  </li>
                  <li>
                    Reconhece que o conteudo podera ser utilizado para fins
                    promocionais e de marketing da Plataforma
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  5.2. Responsabilidade pelo Conteudo
                </h3>
                <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                  Voce e integralmente responsavel pelo conteudo que envia e declara
                  que:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body text-[var(--text-secondary)]">
                  <li>
                    O conteudo nao viola direitos de terceiros, incluindo direitos
                    autorais, marcas registradas, privacidade ou outros direitos
                    pessoais ou de propriedade
                  </li>
                  <li>
                    O conteudo nao e ilegal, difamatorio, obsceno, ofensivo ou de
                    outra forma inadequado
                  </li>
                  <li>
                    Possui todas as autorizacoes necessarias de pessoas retratadas
                    no conteudo
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  5.3. Moderacao
                </h3>
                <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                  Reservamo-nos o direito de, a nosso exclusivo criterio:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body text-[var(--text-secondary)]">
                  <li>Remover ou recusar a publicacao de qualquer conteudo</li>
                  <li>
                    Suspender ou encerrar contas de usuarios que violem estes Termos
                  </li>
                  <li>
                    Tomar as medidas legais cabiveis em caso de violacoes graves
                  </li>
                </ul>
              </div>
            </div>

            {/* Section 6 */}
            <div className="space-y-6">
              <h2 className="text-h2 text-[var(--text-primary)]">
                6. Links de Afiliados e Produtos
              </h2>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  6.1. Programa de Afiliados
                </h3>
                <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                  O SetupsGrid participa de programas de afiliados de diversas lojas
                  e plataformas de e-commerce. Isso significa que:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body text-[var(--text-secondary)]">
                  <li>
                    Links para produtos podem conter identificadores de afiliado
                  </li>
                  <li>
                    Podemos receber comissoes por compras realizadas atraves desses
                    links
                  </li>
                  <li>Isso nao representa custo adicional para voce como consumidor</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  6.2. Informacoes de Produtos
                </h3>
                <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                  As informacoes sobre produtos exibidas na Plataforma (precos,
                  disponibilidade, especificacoes) sao fornecidas por terceiros e
                  podem sofrer alteracoes. Nao garantimos a precisao, atualidade ou
                  disponibilidade dessas informacoes.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  6.3. Relacao de Compra
                </h3>
                <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                  Ao clicar em links de produtos e realizar compras, voce estara
                  estabelecendo uma relacao comercial direta com a loja ou
                  marketplace de destino. O SetupsGrid nao e parte dessa transacao e
                  nao se responsabiliza por:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body text-[var(--text-secondary)]">
                  <li>Processamento de pagamentos</li>
                  <li>Envio e entrega de produtos</li>
                  <li>Qualidade dos produtos adquiridos</li>
                  <li>Politicas de troca e devolucao</li>
                  <li>Atendimento ao consumidor pos-venda</li>
                </ul>
              </div>
            </div>

            {/* Section 7 */}
            <div className="space-y-4">
              <h2 className="text-h2 text-[var(--text-primary)]">
                7. Isencao de Garantias
              </h2>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed font-medium">
                A PLATAFORMA E FORNECIDA &quot;COMO ESTA&quot; E &quot;CONFORME
                DISPONIVEL&quot;, SEM GARANTIAS DE QUALQUER TIPO, EXPRESSAS OU
                IMPLICITAS.
              </p>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Nao garantimos que:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body text-[var(--text-secondary)]">
                <li>
                  A Plataforma estara disponivel de forma ininterrupta ou livre de
                  erros
                </li>
                <li>
                  Os resultados obtidos atraves do uso da Plataforma serao precisos
                  ou confiaveis
                </li>
                <li>
                  A qualidade de quaisquer produtos, servicos ou informacoes obtidas
                  atendera as suas expectativas
                </li>
              </ul>
            </div>

            {/* Section 8 */}
            <div className="space-y-4">
              <h2 className="text-h2 text-[var(--text-primary)]">
                8. Limitacao de Responsabilidade
              </h2>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed font-medium">
                NA MAXIMA EXTENSAO PERMITIDA PELA LEI APLICAVEL, O SETUPSGRID NAO
                SERA RESPONSAVEL POR:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body text-[var(--text-secondary)]">
                <li>
                  Danos indiretos, incidentais, especiais, consequenciais ou
                  punitivos
                </li>
                <li>
                  Perda de lucros, dados, uso, agio ou outras perdas intangiveis
                </li>
                <li>
                  Danos resultantes do uso ou incapacidade de uso da Plataforma
                </li>
                <li>Conduta de terceiros na Plataforma</li>
                <li>
                  Acesso nao autorizado ou alteracao de suas transmissoes ou dados
                </li>
              </ul>
            </div>

            {/* Section 9 */}
            <div className="space-y-4">
              <h2 className="text-h2 text-[var(--text-primary)]">
                9. Indenizacao
              </h2>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Voce concorda em defender, indenizar e isentar o SetupsGrid, seus
                diretores, funcionarios, agentes e parceiros de quaisquer
                reclamacoes, responsabilidades, danos, perdas e despesas (incluindo
                honorarios advocaticios) decorrentes de:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body text-[var(--text-secondary)]">
                <li>Seu uso da Plataforma</li>
                <li>Violacao destes Termos</li>
                <li>Violacao de direitos de terceiros</li>
                <li>Conteudo que voce enviar ou publicar</li>
              </ul>
            </div>

            {/* Section 10 */}
            <div className="space-y-4">
              <h2 className="text-h2 text-[var(--text-primary)]">
                10. Modificacoes dos Termos
              </h2>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Reservamo-nos o direito de modificar estes Termos a qualquer
                momento. As alteracoes entrarao em vigor imediatamente apos a
                publicacao dos Termos atualizados na Plataforma.
              </p>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                O uso continuado da Plataforma apos a publicacao de alteracoes
                constitui sua aceitacao dos novos Termos. Recomendamos que voce
                revise periodicamente esta pagina.
              </p>
            </div>

            {/* Section 11 */}
            <div className="space-y-4">
              <h2 className="text-h2 text-[var(--text-primary)]">
                11. Encerramento
              </h2>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Podemos suspender ou encerrar seu acesso a Plataforma, a nosso
                exclusivo criterio, sem aviso previo, por qualquer motivo, incluindo
                violacao destes Termos.
              </p>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Voce pode encerrar sua conta a qualquer momento, deixando de
                utilizar a Plataforma ou solicitando a exclusao de sua conta.
              </p>
            </div>

            {/* Section 12 */}
            <div className="space-y-6">
              <h2 className="text-h2 text-[var(--text-primary)]">
                12. Disposicoes Gerais
              </h2>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  12.1. Lei Aplicavel
                </h3>
                <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                  Estes Termos sao regidos pelas leis da Republica Federativa do
                  Brasil.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">12.2. Foro</h3>
                <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                  Fica eleito o foro da Comarca de Sao Paulo/SP, Brasil, para
                  dirimir quaisquer controversias decorrentes destes Termos, com
                  renuncia a qualquer outro, por mais privilegiado que seja.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  12.3. Divisibilidade
                </h3>
                <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                  Se qualquer disposicao destes Termos for considerada invalida ou
                  inexequivel, as demais disposicoes permanecerao em pleno vigor e
                  efeito.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  12.4. Renuncia
                </h3>
                <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                  A falha do SetupsGrid em exercer ou fazer cumprir qualquer direito
                  ou disposicao destes Termos nao constituira renuncia a tal direito
                  ou disposicao.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  12.5. Acordo Integral
                </h3>
                <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                  Estes Termos constituem o acordo integral entre voce e o
                  SetupsGrid em relacao ao uso da Plataforma e substituem quaisquer
                  acordos anteriores.
                </p>
              </div>
            </div>

            {/* Section 13 */}
            <div className="space-y-4">
              <h2 className="text-h2 text-[var(--text-primary)]">13. Contato</h2>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Em caso de duvidas sobre estes Termos de Uso, entre em contato
                conosco:
              </p>
              <ul className="list-none space-y-2 text-body text-[var(--text-secondary)]">
                <li>
                  <strong>E-mail:</strong> contato@setupsgrid.com
                </li>
                <li>
                  <strong>Site:</strong> setupsgrid.com
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
