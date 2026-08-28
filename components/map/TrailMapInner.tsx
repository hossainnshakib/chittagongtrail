"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface ValidTrail {
  id: number;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
}

interface TrailMapInnerProps {
  trails: ValidTrail[];
}

export function TrailMapInner({ trails }: TrailMapInnerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [22.3569, 91.7933],
      zoom: 12,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const markerIcon = L.divIcon({
      className: "custom-marker",
      html: `<div style="background-color: #C9A882; width: 24px; height: 24px; border-radius: 50%; border: 3px solid #3E2723; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    trails.forEach((trail) => {
      const marker = L.marker([trail.latitude, trail.longitude], {
        icon: markerIcon,
      }).addTo(map);

      marker.bindPopup(
        `<div style="min-width: 150px;">
          <h3 style="font-family: Georgia, serif; font-size: 16px; font-weight: 600; margin: 0 0 8px 0; color: #5D4037;">${trail.name}</h3>
          <a href="/trails/${trail.slug}" style="color: #C9A882; text-decoration: none; font-size: 14px;">View Trail →</a>
        </div>`,
        {
          className: "custom-popup",
        }
      );
    });

    if (trails.length > 0) {
      const bounds = L.latLngBounds(
        trails.map((trail) => [trail.latitude, trail.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [trails]);

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="aspect-[16/9] md:aspect-[21/9] rounded-lg overflow-hidden"
        style={{ zIndex: 1 }}
      />
      <div className="sr-only">
        <h3>Trail Locations Map</h3>
        <ul>
          {trails.map((trail) => (
            <li key={trail.id}>
              <Link href={`/trails/${trail.slug}`}>
                {trail.name} - Coordinates: {trail.latitude}, {trail.longitude}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
