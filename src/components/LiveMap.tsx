"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LiveMapProps {
  origin: { name: string; location: { lat: number; lng: number } };
  destination: { name: string; location: { lat: number; lng: number } };
  currentLocation?: { lat: number; lng: number };
  routePoints?: { lat: number; lng: number }[];
  status?: string;
  reroute?: { name: string; location: { lat: number; lng: number } } | null;
}

export default function LiveMap({
  origin,
  destination,
  currentLocation,
  routePoints,
  status,
  reroute,
}: LiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Destroy previous map instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Create map
    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    });
    mapInstanceRef.current = map;

    // Dark tile layer (CartoDB Dark Matter)
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      { maxZoom: 19 }
    ).addTo(map);

    // Custom icon helpers
    const makeIcon = (color: string, size: number = 10) =>
      L.divIcon({
        className: "",
        html: `<div style="width:${size}px;height:${size}px;background:${color};border-radius:50%;border:2px solid rgba(255,255,255,0.6);box-shadow:0 0 8px ${color}80;"></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

    const truckIcon = L.divIcon({
      className: "",
      html: `<div style="width:14px;height:14px;background:${status === "emergency" ? "#FF3B30" : "#007AFF"};border-radius:50%;border:3px solid white;box-shadow:0 0 12px ${status === "emergency" ? "#FF3B30" : "#007AFF"};animation:pulse 1.5s infinite;"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

    // Origin marker (green)
    L.marker([origin.location.lat, origin.location.lng], {
      icon: makeIcon("#34C759"),
    })
      .addTo(map)
      .bindTooltip(origin.name, {
        permanent: true,
        direction: "top",
        className: "map-tooltip",
        offset: [0, -8],
      });

    // Destination marker (blue)
    L.marker([destination.location.lat, destination.location.lng], {
      icon: makeIcon("#007AFF"),
    })
      .addTo(map)
      .bindTooltip(destination.name, {
        permanent: true,
        direction: "top",
        className: "map-tooltip",
        offset: [0, -8],
      });

    // Route polyline
    const points =
      routePoints && routePoints.length > 0
        ? routePoints.map((p) => [p.lat, p.lng] as [number, number])
        : [
            [origin.location.lat, origin.location.lng] as [number, number],
            [destination.location.lat, destination.location.lng] as [number, number],
          ];

    L.polyline(points, {
      color: "#34C759",
      weight: 3,
      opacity: 0.8,
      dashArray: status === "in_transit" ? undefined : "8 6",
    }).addTo(map);

    // Remaining route (dashed)
    if (currentLocation && points.length > 1) {
      // Find nearest point index to current location
      let nearestIdx = 0;
      let nearestDist = Infinity;
      points.forEach(([lat, lng], i) => {
        const d = Math.sqrt(
          (lat - currentLocation.lat) ** 2 + (lng - currentLocation.lng) ** 2
        );
        if (d < nearestDist) {
          nearestDist = d;
          nearestIdx = i;
        }
      });

      // Draw remaining route in dashed blue
      const remaining = points.slice(nearestIdx);
      if (remaining.length > 1) {
        L.polyline(remaining, {
          color: "#007AFF",
          weight: 2,
          opacity: 0.5,
          dashArray: "8 6",
        }).addTo(map);
      }
    }

    // Reroute marker (red)
    if (reroute) {
      L.marker([reroute.location.lat, reroute.location.lng], {
        icon: makeIcon("#FF3B30", 12),
      })
        .addTo(map)
        .bindTooltip(reroute.name, {
          permanent: true,
          direction: "right",
          className: "map-tooltip-emergency",
          offset: [8, 0],
        });

      // Reroute path from current location
      if (currentLocation) {
        L.polyline(
          [
            [currentLocation.lat, currentLocation.lng],
            [reroute.location.lat, reroute.location.lng],
          ],
          { color: "#FF3B30", weight: 3, opacity: 0.9 }
        ).addTo(map);
      }
    }

    // Current location / truck marker
    if (currentLocation) {
      L.marker([currentLocation.lat, currentLocation.lng], {
        icon: truckIcon,
      })
        .addTo(map)
        .bindTooltip("Truck Location", {
          direction: "top",
          className: "map-tooltip",
          offset: [0, -10],
        });
    }

    // Fit bounds to show everything
    const allPoints: [number, number][] = [
      [origin.location.lat, origin.location.lng],
      [destination.location.lat, destination.location.lng],
    ];
    if (currentLocation) allPoints.push([currentLocation.lat, currentLocation.lng]);
    if (reroute) allPoints.push([reroute.location.lat, reroute.location.lng]);

    map.fitBounds(L.latLngBounds(allPoints), { padding: [30, 30] });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [origin, destination, currentLocation, routePoints, status, reroute]);

  return (
    <>
      <style>{`
        .map-tooltip {
          background: rgba(0,0,0,0.85) !important;
          border: 1px solid rgba(255,255,255,0.15) !important;
          color: #fff !important;
          font-family: ui-monospace, monospace !important;
          font-size: 10px !important;
          padding: 3px 8px !important;
          border-radius: 6px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4) !important;
        }
        .map-tooltip::before { display: none !important; }
        .map-tooltip-emergency {
          background: rgba(255,59,48,0.9) !important;
          border: 1px solid rgba(255,255,255,0.3) !important;
          color: #fff !important;
          font-family: ui-monospace, monospace !important;
          font-size: 10px !important;
          font-weight: bold !important;
          padding: 3px 8px !important;
          border-radius: 6px !important;
        }
        .map-tooltip-emergency::before { display: none !important; }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
      `}</style>
      <div ref={mapRef} className="w-full h-full rounded-xl" />
    </>
  );
}
