import { Header, Footer, SetupGrid } from "@/components";
import { getSetups } from "@/lib/data";

export default async function HomePage() {
  const setups = await getSetups();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 lg:py-20 text-center px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight mb-4">
              Inspiração para seu{" "}
              <span className="gradient-text">Setup</span>
            </h1>
            <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
              Descubra setups incríveis e encontre os produtos perfeitos para
              montar seu workspace dos sonhos.
            </p>
          </div>
        </section>

        {/* Setups Grid */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-[1800px] mx-auto">
            {/* Results count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-[var(--text-secondary)]">
                {setups.length} setups encontrados
              </p>
            </div>

            {/* Grid */}
            <SetupGrid setups={setups} />

            {/* Load more button - UI ready for future implementation */}
            {setups.length >= 12 && (
              <div className="mt-12 text-center">
                <button className="btn-secondary">
                  Carregar mais
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
