import Link from "next/link";
import { SectionReveal } from "@/components/ui";

const experiences = [
  { title: "Walk the hills at dawn", desc: "Batali Hill, Khujra Hill, Ferraz Hill — Chittagong rises from the plain in a chain of green peaks. The city looks different from above.", link: "/trails" },
  { title: "Follow the Karnaphuli", desc: "The river that built Chittagong. Boats, bridges, ghats, and the old port — the city's life flows along its banks.", link: "/trails" },
  { title: "Eat mezbani beef", desc: "Slow-cooked, spice-rich, served on banana leaves. Mezbani is Chittagong's signature feast — and an argument about whose grandmother does it best.", link: "/food" },
  { title: "Find the old port", desc: "Where the British landed, where the Mughals traded, where the city began. The old quarters hold their stories close.", link: "/trails" },
  { title: "Taste shutki", desc: "Dried fish, fermented and fierce. Chittagong's most honest flavour — not for everyone, but unforgettable.", link: "/food" },
  { title: "Watch the sunset at Patenga", desc: "Where the Bay of Bengal meets the river mouth. Fishermen, families, and the last light over the water.", link: "/trails" },
  { title: "Read the stories", desc: "Every trail has a story. Every food has a history. Every neighbourhood has something worth discovering.", link: "/journal" },
  { title: "Get lost in the old city", desc: "Winding lanes, colonial buildings, mosques, temples, markets. Chittagong's old quarters reward those who wander.", link: "/trails" },
  { title: "Drive the coast road", desc: "Patenga to Banshkhali, fishing villages to empty beaches. The coast south of Chittagong is still undiscovered.", link: "/trails" },
];

export function ExperiencesGrid() {
  return (
    <section className="ct-section ct-cream">
      <div className="ct-container">
        <SectionReveal>
          <div className="mb-8 md:mb-12">
            <p className="text-text-muted text-sm mb-2">Things you can only do here</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-text">
              Reasons to explore Chittagong
            </h2>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 md:gap-y-10">
          {experiences.map((exp, i) => (
            <SectionReveal key={i}>
              <Link href={exp.link} className="group block" data-reveal>
                <div className="flex gap-4">
                  <span className="ct-number text-3xl md:text-4xl mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-lg md:text-xl font-semibold text-text group-hover:text-accent transition-colors duration-200 mb-1.5">
                      {exp.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{exp.desc}</p>
                    <span className="inline-flex items-center gap-1 text-accent text-xs uppercase tracking-[0.15em] font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Discover →
                    </span>
                  </div>
                </div>
              </Link>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
