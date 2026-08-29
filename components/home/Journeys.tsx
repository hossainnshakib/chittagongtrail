import Link from "next/link";
import { SectionReveal } from "@/components/ui";

const journeys = [
  { num: "01", days: "3 days", title: "Hills and *River*", desc: "Batali Hill at dawn, the Karnaphuli by boat, old Chittagong on foot. The city's essential landscape in three days.", link: "/trails" },
  { num: "02", days: "5 days", title: "Coast to *Hills*", desc: "Patenga beach, the coast road south, then inland to the hill tracts. From sea level to the clouds.", link: "/trails" },
  { num: "03", days: "4 days", title: "Food and *Markets*", desc: "Mezbani feasts, shutki markets, street food at dusk. Chittagong through its flavours.", link: "/food" },
  { num: "04", days: "7 days", title: "The Full *Chittagong*", desc: "Hills, coast, river, city, countryside. Every terrain, every flavour, every story.", link: "/trails" },
];

export function Journeys() {
  return (
    <section className="ct-section ct-dark">
      <div className="ct-container">
        <SectionReveal>
          <div className="mb-8 md:mb-12">
            <p className="text-accent text-xs uppercase tracking-[0.2em] font-medium mb-2">Ready-made routes</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-dark-text">
              Journeys through Chittagong
            </h2>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {journeys.map((j) => (
            <SectionReveal key={j.num}>
              <Link href={j.link} className="group block p-5 md:p-7 rounded-lg border border-dark-text/10 hover:border-dark-text/20 transition-colors" data-reveal>
                <div className="flex items-start gap-4">
                  <span className="ct-number text-2xl md:text-3xl text-dark-accent shrink-0">{j.num}</span>
                  <div>
                    <span className="text-dark-text/30 text-xs uppercase tracking-wider">{j.days}</span>
                    <h3
                      className="font-display text-xl md:text-2xl font-semibold text-dark-text mt-1 mb-1.5 group-hover:text-accent transition-colors"
                      dangerouslySetInnerHTML={{ __html: j.title.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>') }}
                    />
                    <p className="text-dark-text/50 text-sm leading-relaxed">{j.desc}</p>
                    <span className="inline-flex items-center gap-1 text-accent text-xs uppercase tracking-[0.15em] font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      See route →
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
