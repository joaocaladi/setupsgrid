import { HeaderWrapper, Footer } from "@/components";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de Privacidade - SetupsGrid",
  description:
    "Leia a Politica de Privacidade do SetupsGrid. Informacoes sobre como coletamos, usamos e protegemos seus dados pessoais.",
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <HeaderWrapper />

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
              Politica de Privacidade.
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
                A sua privacidade e importante para nos. Esta Politica de
                Privacidade explica como o SetupsGrid (&quot;nos&quot;,
                &quot;nosso&quot; ou &quot;Plataforma&quot;), operado por Anma,
                coleta, usa, armazena e protege suas informacoes pessoais quando
                voce utiliza o site setupsgrid.com.
              </p>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Esta politica foi elaborada em conformidade com a Lei Geral de
                Protecao de Dados Pessoais (Lei n 13.709/2018 - LGPD) e demais
                normas aplicaveis.
              </p>
            </div>

            {/* Section 1 */}
            <div className="space-y-6">
              <h2 className="text-h2 text-[var(--text-primary)]">
                1. Informacoes que Coletamos
              </h2>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  1.1. Informacoes Fornecidas por Voce
                </h3>
                <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                  Podemos coletar informacoes que voce nos fornece diretamente,
                  incluindo:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body text-[var(--text-secondary)]">
                  <li>
                    <strong>Dados de cadastro:</strong> nome, endereco de e-mail,
                    nome de usuario e senha ao criar uma conta
                  </li>
                  <li>
                    <strong>Dados de perfil:</strong> foto de perfil, biografia e
                    preferencias de configuracao
                  </li>
                  <li>
                    <strong>Conteudo enviado:</strong> fotos de setups,
                    descricoes, listas de produtos e comentarios
                  </li>
                  <li>
                    <strong>Comunicacoes:</strong> mensagens enviadas atraves de
                    formularios de contato ou e-mail
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  1.2. Informacoes Coletadas Automaticamente
                </h3>
                <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                  Quando voce acessa a Plataforma, coletamos automaticamente:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body text-[var(--text-secondary)]">
                  <li>
                    <strong>Dados de navegacao:</strong> endereco IP, tipo de
                    navegador, sistema operacional, paginas visitadas, tempo de
                    permanencia e padroes de clique
                  </li>
                  <li>
                    <strong>Dados de dispositivo:</strong> tipo de dispositivo,
                    identificadores unicos, resolucao de tela e fuso horario
                  </li>
                  <li>
                    <strong>Cookies e tecnologias similares:</strong> conforme
                    detalhado na secao especifica abaixo
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  1.3. Informacoes de Terceiros
                </h3>
                <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                  Podemos receber informacoes de terceiros, como:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body text-[var(--text-secondary)]">
                  <li>
                    Dados de login social (se voce optar por conectar via Google,
                    Apple ou outras plataformas)
                  </li>
                  <li>Informacoes de parceiros de analise e publicidade</li>
                </ul>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-6">
              <h2 className="text-h2 text-[var(--text-primary)]">
                2. Como Utilizamos suas Informacoes
              </h2>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Utilizamos suas informacoes pessoais para:
              </p>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  2.1. Prestacao do Servico
                </h3>
                <ul className="list-disc list-inside space-y-2 text-body text-[var(--text-secondary)]">
                  <li>Criar e gerenciar sua conta</li>
                  <li>Exibir e personalizar conteudo relevante</li>
                  <li>Processar e publicar conteudo enviado por voce</li>
                  <li>Responder a suas solicitacoes e fornecer suporte</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  2.2. Melhoria da Plataforma
                </h3>
                <ul className="list-disc list-inside space-y-2 text-body text-[var(--text-secondary)]">
                  <li>Analisar padroes de uso e comportamento de navegacao</li>
                  <li>Desenvolver novos recursos e funcionalidades</li>
                  <li>Realizar pesquisas e analises estatisticas</li>
                  <li>Identificar e corrigir problemas tecnicos</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  2.3. Comunicacao
                </h3>
                <ul className="list-disc list-inside space-y-2 text-body text-[var(--text-secondary)]">
                  <li>Enviar notificacoes sobre sua conta e atividades</li>
                  <li>Enviar newsletters e atualizacoes (com seu consentimento)</li>
                  <li>Informar sobre alteracoes em nossos termos e politicas</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  2.4. Seguranca e Conformidade
                </h3>
                <ul className="list-disc list-inside space-y-2 text-body text-[var(--text-secondary)]">
                  <li>Detectar e prevenir fraudes e atividades suspeitas</li>
                  <li>Cumprir obrigacoes legais e regulatorias</li>
                  <li>Proteger nossos direitos e propriedade</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  2.5. Monetizacao via Afiliados
                </h3>
                <ul className="list-disc list-inside space-y-2 text-body text-[var(--text-secondary)]">
                  <li>
                    Rastrear cliques em links de afiliados para fins de
                    comissionamento
                  </li>
                  <li>Analisar performance de produtos e parceiros</li>
                </ul>
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <h2 className="text-h2 text-[var(--text-primary)]">
                3. Base Legal para o Tratamento
              </h2>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Tratamos seus dados pessoais com base nas seguintes hipoteses
                legais da LGPD:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body text-[var(--text-secondary)]">
                <li>
                  <strong>Consentimento:</strong> para envio de comunicacoes de
                  marketing e newsletters
                </li>
                <li>
                  <strong>Execucao de contrato:</strong> para prestacao dos
                  servicos da Plataforma
                </li>
                <li>
                  <strong>Legitimo interesse:</strong> para melhoria da
                  Plataforma, seguranca e prevencao de fraudes
                </li>
                <li>
                  <strong>Cumprimento de obrigacao legal:</strong> para atender
                  requisitos legais e regulatorios
                </li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="space-y-6">
              <h2 className="text-h2 text-[var(--text-primary)]">
                4. Compartilhamento de Informacoes
              </h2>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  4.1. Parceiros de Afiliados
                </h3>
                <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                  Compartilhamos identificadores de clique com nossos parceiros de
                  programas de afiliados (como Amazon, KaBuM, Mercado Livre, entre
                  outros) para fins de rastreamento de comissoes.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  4.2. Prestadores de Servico
                </h3>
                <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                  Podemos compartilhar informacoes com prestadores de servico que
                  nos auxiliam na operacao da Plataforma, incluindo:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body text-[var(--text-secondary)]">
                  <li>Servicos de hospedagem e infraestrutura (ex: Vercel, Supabase)</li>
                  <li>Servicos de analise e metricas (ex: Google Analytics)</li>
                  <li>Servicos de e-mail e comunicacao</li>
                  <li>Processadores de pagamento (se aplicavel)</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  4.3. Requisitos Legais
                </h3>
                <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                  Podemos divulgar suas informacoes quando exigido por lei, ordem
                  judicial ou processo legal, ou quando necessario para proteger
                  nossos direitos, propriedade ou seguranca.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  4.4. Transferencia de Negocio
                </h3>
                <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                  Em caso de fusao, aquisicao ou venda de ativos, suas informacoes
                  podem ser transferidas como parte da transacao.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div className="space-y-6">
              <h2 className="text-h2 text-[var(--text-primary)]">
                5. Cookies e Tecnologias de Rastreamento
              </h2>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  5.1. O que sao Cookies
                </h3>
                <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                  Cookies sao pequenos arquivos de texto armazenados em seu
                  dispositivo que nos permitem reconhece-lo e lembrar suas
                  preferencias.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  5.2. Tipos de Cookies que Utilizamos
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-body text-[var(--text-secondary)] border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th className="text-left py-3 pr-4 font-semibold text-[var(--text-primary)]">
                          Tipo
                        </th>
                        <th className="text-left py-3 pr-4 font-semibold text-[var(--text-primary)]">
                          Finalidade
                        </th>
                        <th className="text-left py-3 font-semibold text-[var(--text-primary)]">
                          Duracao
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--border)]">
                        <td className="py-3 pr-4">Essenciais</td>
                        <td className="py-3 pr-4">
                          Necessarios para o funcionamento basico da Plataforma
                        </td>
                        <td className="py-3">Sessao</td>
                      </tr>
                      <tr className="border-b border-[var(--border)]">
                        <td className="py-3 pr-4">Funcionais</td>
                        <td className="py-3 pr-4">
                          Lembram suas preferencias e configuracoes
                        </td>
                        <td className="py-3">Persistentes</td>
                      </tr>
                      <tr className="border-b border-[var(--border)]">
                        <td className="py-3 pr-4">Analiticos</td>
                        <td className="py-3 pr-4">
                          Coletam dados sobre como voce usa a Plataforma
                        </td>
                        <td className="py-3">Persistentes</td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-4">De Afiliados</td>
                        <td className="py-3 pr-4">
                          Rastreiam cliques em links de produtos para comissionamento
                        </td>
                        <td className="py-3">Variavel</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-h3 text-[var(--text-primary)]">
                  5.3. Gerenciamento de Cookies
                </h3>
                <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                  Voce pode configurar seu navegador para recusar cookies ou
                  alerta-lo quando cookies estao sendo enviados. No entanto,
                  algumas funcionalidades da Plataforma podem nao funcionar
                  corretamente sem cookies.
                </p>
              </div>
            </div>

            {/* Section 6 */}
            <div className="space-y-4">
              <h2 className="text-h2 text-[var(--text-primary)]">
                6. Seus Direitos
              </h2>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                De acordo com a LGPD, voce tem os seguintes direitos em relacao
                aos seus dados pessoais:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body text-[var(--text-secondary)]">
                <li>
                  <strong>Confirmacao e acesso:</strong> confirmar a existencia de
                  tratamento e acessar seus dados
                </li>
                <li>
                  <strong>Correcao:</strong> solicitar a correcao de dados
                  incompletos, inexatos ou desatualizados
                </li>
                <li>
                  <strong>Anonimizacao, bloqueio ou eliminacao:</strong> de dados
                  desnecessarios, excessivos ou tratados em desconformidade
                </li>
                <li>
                  <strong>Portabilidade:</strong> solicitar a transferencia de
                  seus dados a outro fornecedor de servico
                </li>
                <li>
                  <strong>Eliminacao:</strong> solicitar a eliminacao dos dados
                  tratados com seu consentimento
                </li>
                <li>
                  <strong>Informacao:</strong> ser informado sobre entidades com
                  as quais compartilhamos seus dados
                </li>
                <li>
                  <strong>Revogacao do consentimento:</strong> revogar seu
                  consentimento a qualquer momento
                </li>
                <li>
                  <strong>Oposicao:</strong> opor-se a tratamento que viole a LGPD
                </li>
              </ul>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Para exercer qualquer desses direitos, entre em contato conosco
                atraves dos canais indicados ao final desta politica.
              </p>
            </div>

            {/* Section 7 */}
            <div className="space-y-4">
              <h2 className="text-h2 text-[var(--text-primary)]">
                7. Retencao de Dados
              </h2>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Mantemos suas informacoes pessoais pelo tempo necessario para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body text-[var(--text-secondary)]">
                <li>Fornecer os servicos solicitados</li>
                <li>Cumprir obrigacoes legais e regulatorias</li>
                <li>Resolver disputas e fazer cumprir nossos acordos</li>
              </ul>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Apos o termino da finalidade ou a solicitacao de eliminacao, seus
                dados serao excluidos ou anonimizados, salvo quando houver
                obrigacao legal de retencao.
              </p>
            </div>

            {/* Section 8 */}
            <div className="space-y-4">
              <h2 className="text-h2 text-[var(--text-primary)]">
                8. Seguranca das Informacoes
              </h2>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Implementamos medidas tecnicas e organizacionais para proteger
                suas informacoes pessoais, incluindo:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body text-[var(--text-secondary)]">
                <li>Criptografia de dados em transito (HTTPS/SSL)</li>
                <li>Controles de acesso baseados em funcao</li>
                <li>Monitoramento de atividades suspeitas</li>
                <li>Backups regulares e planos de recuperacao</li>
              </ul>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Embora nos esforcemos para proteger suas informacoes, nenhum
                metodo de transmissao pela Internet ou armazenamento eletronico e
                100% seguro.
              </p>
            </div>

            {/* Section 9 */}
            <div className="space-y-4">
              <h2 className="text-h2 text-[var(--text-primary)]">
                9. Transferencia Internacional de Dados
              </h2>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Alguns de nossos prestadores de servico podem estar localizados em
                outros paises. Nesses casos, garantimos que a transferencia
                internacional de dados seja realizada em conformidade com a LGPD,
                mediante:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body text-[var(--text-secondary)]">
                <li>Clausulas contratuais padrao</li>
                <li>Certificacoes de privacidade reconhecidas</li>
                <li>Outras salvaguardas adequadas previstas em lei</li>
              </ul>
            </div>

            {/* Section 10 */}
            <div className="space-y-4">
              <h2 className="text-h2 text-[var(--text-primary)]">
                10. Menores de Idade
              </h2>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                A Plataforma nao e direcionada a menores de 18 anos. Nao coletamos
                intencionalmente informacoes de menores. Se tomarmos conhecimento
                de que coletamos dados de um menor sem o consentimento dos pais ou
                responsaveis, tomaremos medidas para excluir essas informacoes.
              </p>
            </div>

            {/* Section 11 */}
            <div className="space-y-4">
              <h2 className="text-h2 text-[var(--text-primary)]">
                11. Links para Sites de Terceiros
              </h2>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                A Plataforma contem links para sites de terceiros, especialmente
                lojas de e-commerce. Esta Politica de Privacidade nao se aplica a
                esses sites. Recomendamos que voce leia as politicas de
                privacidade de cada site que visitar.
              </p>
            </div>

            {/* Section 12 */}
            <div className="space-y-4">
              <h2 className="text-h2 text-[var(--text-primary)]">
                12. Alteracoes nesta Politica
              </h2>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Podemos atualizar esta Politica de Privacidade periodicamente.
                Notificaremos voce sobre alteracoes significativas atraves de:
              </p>
              <ul className="list-disc list-inside space-y-2 text-body text-[var(--text-secondary)]">
                <li>Aviso destacado na Plataforma</li>
                <li>E-mail (se voce tiver uma conta cadastrada)</li>
              </ul>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                A data da ultima atualizacao sera sempre indicada no topo deste
                documento.
              </p>
            </div>

            {/* Section 13 */}
            <div className="space-y-4">
              <h2 className="text-h2 text-[var(--text-primary)]">
                13. Contato e Encarregado de Dados
              </h2>
              <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                Para questoes relacionadas a esta Politica de Privacidade ou para
                exercer seus direitos, entre em contato:
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
