import Link from "next/link";
import { Container, SectionReveal } from "@/components/ui";

const experiences = [
  {
    title: "Walk the hills at dawn",
    description: "Batali Hill, Khujra Hill, Ferraz Hill — Chittagong rises from the plain in a chain of green peaks. The city looks different from above.",
    link: "/trails",
  },
  {
    title: "Follow the Karnaphuli",
    description: "The river that built Chittagong. Boats, bridges, ghats, and the old port — the city's life flows along its banks.",
    link: "/trails",
  },
  {
    title: "Eat mezbani beef",
    description: "Slow-cooked, spice-rich, served on banana leaves. Mezbani is Chittagong's signature feast — and an argument about whose grandmother does it best.",
    link: "/food",
  },
  {
    title: "Find the old port",
    description: "Where the British landed, where the Mughals traded, where the city began. The old quarters hold their stories close.",
    link: "/trails",
  },
  {
    title: "Taste shutki",
    description: "Dried fish, fermented and fierce. Chittagong's most honest flavour — not for everyone, but unforgettable.",
    link: "/food",
  },
  {
    title: "Watch the sunset at Patenga",
    description: "Where the Bay of Bengal meets the river mouth. Fishermen, families, and the last light over the water.",
    link: "/trails",
  },
  {
    title: "Read the stories",
    description: "Every trail has a story. Every food has a history. Every neighbourhood has something worth discovering.",
    link: "/journal",
  },
  {
    title: "Get lost in the old city",
    description: "Winding lanes, colonial buildings, mosques, temples, markets. Chittagong's old quarters reward those who wander.",
    link: "/trails",
  },
  {
    title: "Drive the coast road",
    description: "Patenga to Banshkhali, fishing villages to empty beaches. The coast south of Chittagong is still undiscovered.",
    link: "/trails",
  },
];

export function ExperiencesGrid() {
  return (
    <section className="section-cream py-16 md:py-24 lg:py-32">
      <Container>
        <SectionReveal>
          <div className="mb-10 md:mb-14">
            <p className="text-accent text-xs uppercase tracking-[0.2em] font-medium mb-3">
              Things you can only do here
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-text">
              Reasons to explore Chittagong
            </h2>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {experiences.map((exp, index) => (
            <SectionReveal key={index}>
              <Link
                href={exp.link}
                className="group block"
                data-reveal
              >
                <div className="flex gap-4">
                  <span className="text-accent/40 font-display text-4xl md:text-5xl font-bold leading-none mt-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-lg md:text-xl font-semibold text-text group-hover:text-accent transition-colors duration-300 mb-2">
                      {exp.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {exp.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-accent text-xs uppercase tracking-[0.15em] font-medium mt-3 group-hover:gap-2 transition-all duration-200">
                      Discover
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
