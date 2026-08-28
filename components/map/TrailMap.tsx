"use client";

import { useEffect, useState } from "react";

interface Trail {
  id: number;
  name: string;
  slug: string;
  latitude: number | null;
  longitude: number | null;
}

interface TrailMapProps {
  trails: Trail[];
}

export function TrailMap({ trails }: TrailMapProps) {
  const [MapComponent, setMapComponent] = useState<
    React.ComponentType<{ trails: ValidTrail[] }> | null
  >(null);

  const validTrails = trails.filter(
    (t): t is ValidTrail => t.latitude !== null && t.longitude !== null
  );

  useEffect(() => {
    import("./TrailMapInner").then((mod) => {
      setMapComponent(() => mod.TrailMapInner);
    });
  }, []);

  if (validTrails.length === 0) {
    return (
      <div className="aspect-[16/9] rounded-lg overflow-hidden bg-dark-bg/50 border border-dark-text/20 flex items-center justify-center">
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
            Map will display as trails are documented
          </p>
          <p className="text-dark-text/40 text-sm mt-2">
            Chittagong&apos;s locations will appear here
          </p>
        </div>
      </div>
    );
  }

  if (!MapComponent) {
    return (
      <div className="aspect-[16/9] rounded-lg overflow-hidden bg-dark-bg/50 border border-dark-text/20 flex items-center justify-center">
        <p className="text-dark-text/60">Loading map...</p>
      </div>
    );
  }

  return <MapComponent trails={validTrails} />;
}

interface ValidTrail {
  id: number;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
}
