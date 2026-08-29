import Link from "next/link";
import { Container, SectionReveal } from "@/components/ui";

const journeys = [
  {
    number: "01",
    days: "3 days",
    title: "Hills and *River*",
    description: "Batali Hill at dawn, the Karnaphuli by boat, old Chittagong on foot. The city's essential landscape in three days.",
    link: "/trails",
  },
  {
    number: "02",
    days: "5 days",
    title: "Coast to *Hills*",
    description: "Patenga beach, the coast road south, then inland to the hill tracts. From sea level to the clouds.",
    link: "/trails",
  },
  {
    number: "03",
    days: "4 days",
    title: "Food and *Markets*",
    description: "Mezbani feasts, shutki markets, street food at dusk. Chittagong through its flavours.",
    link: "/food",
  },
  {
    number: "04",
    days: "7 days",
    title: "The Full *Chittagong*",
    description: "Hills, coast, river, city, countryside. Every terrain, every flavour, every story. The complete exploration.",
    link: "/trails",
  },
];

export function Journeys() {
  return (
    <section className="section-dark py-16 md:py-24 lg:py-32">
      <Container>
        <SectionReveal>
          <div className="mb-10 md:mb-14">
            <p className="text-accent text-xs uppercase tracking-[0.2em] font-medium mb-3">
              Ready-made routes
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-dark-text">
              Journeys through Chittagong
            </h2>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {journeys.map((journey) => (
            <SectionReveal key={journey.number}>
              <Link
                href={journey.link}
                className="group block p-6 md:p-8 rounded-lg border border-dark-text/10 hover:border-dark-text/20 transition-colors duration-300"
                data-reveal
              >
                <div className="flex items-start gap-4">
                  <span className="text-accent/40 font-display text-3xl md:text-4xl font-bold leading-none">
                    {journey.number}
                  </span>
                  <div className="flex-1">
                    <span className="text-dark-text/40 text-xs uppercase tracking-[0.15em]">
                      {journey.days}
                    </span>
                    <h3
                      className="font-display text-xl md:text-2xl font-semibold text-dark-text mt-1 mb-2 group-hover:text-accent transition-colors duration-300"
                      dangerouslySetInnerHTML={{
                        __html: journey.title.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>'),
                      }}
                    />
                    <p className="text-dark-text/60 text-sm leading-relaxed">
                      {journey.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-accent text-xs uppercase tracking-[0.15em] font-medium mt-3 group-hover:gap-2 transition-all duration-200">
                      See route
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </SectionReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
