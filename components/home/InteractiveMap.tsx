"use client";

import { Container, SectionHeading } from "@/components/ui";

export function InteractiveMap() {
  return (
    <section className="section bg-dark-bg">
      <Container>
        <SectionHeading
          title="Discover Chittagong"
          subtitle="Explore the trails and locations on the map."
          className="text-dark-text"
        />

        <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-lg overflow-hidden bg-dark-bg/50 border border-dark-text/20">
          {/* Map will be integrated here */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <svg
                className="w-12 h-12 mx-auto text-dark-text/40 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <p className="text-dark-text/60 text-lg">
                Interactive map coming soon
              </p>
              <p className="text-dark-text/40 text-sm mt-2">
                Leaflet + OpenStreetMap integration
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
