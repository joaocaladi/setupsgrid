import { Header, Footer, SetupGrid } from "@/components";
import { getSetups } from "@/lib/data";

export default async function HomePage() {
  const setups = await getSetups();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Header />

      <main className="flex-1">
        {/* Hero Section - Apple style with generous spacing */}
        <section className="section-padding text-center">
          <div className="container-text">
            <h1 className="text-display text-[var(--text-primary)] mb-6">
              Inspiração.
            </h1>
            <p className="text-body-large text-[var(--text-secondary)] max-w-[680px] mx-auto">
              Descubra setups incríveis e encontre os produtos perfeitos.
            </p>
          </div>
        </section>

        {/* Setups Grid */}
        <section className="pb-20 md:pb-32">
          <div className="container-wide">
            {/* Section header */}
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="text-h3 text-[var(--text-primary)]">
                Explore setups
              </h2>
              <span className="text-caption">
                {setups.length} setups
              </span>
            </div>

            {/* Grid */}
            <SetupGrid setups={setups} />

            {/* Load more button - Apple style */}
            {setups.length >= 12 && (
              <div className="mt-16 text-center">
                <button className="link-arrow">
                  Ver mais setups
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
