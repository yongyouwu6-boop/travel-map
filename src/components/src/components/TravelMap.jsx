import { useEffect, useRef } from "react";
import L from "leaflet";

export default function TravelMap({ country, activeStopId, onSelectStop }) {
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const layersRef = useRef([]);

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) return;

    mapRef.current = L.map(mapElementRef.current, {
      zoomControl: false,
      scrollWheelZoom: true,
    }).setView(country.center, country.zoom);

    L.control.zoom({ position: "bottomleft" }).addTo(mapRef.current);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    layersRef.current.forEach((layer) => layer.remove());
    layersRef.current = [];

    const route = country.routeStops.map((stop) => stop.coordinates);
    if (route.length >= 2) {
      const routeLine = L.polyline(route, {
        color: "#b13f3c",
        weight: 4,
        opacity: 0.88,
        lineJoin: "round",
      }).addTo(map);
      layersRef.current.push(routeLine);
    }

    country.routeStops.forEach((stop, index) => {
      const isActive = stop.id === activeStopId;
      const marker = L.marker(stop.coordinates, {
        icon: L.divIcon({
          className: "route-marker-shell",
          html: `<span class="route-marker ${isActive ? "active" : ""}">${index + 1}</span>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        }),
      })
        .addTo(map)
        .bindTooltip(stop.name, { direction: "top", offset: [0, -16] })
        .on("click", () => onSelectStop(stop.id));
      layersRef.current.push(marker);
    });

    if (route.length === 1) {
      map.setView(route[0], Math.max(country.zoom, 8));
    } else if (route.length > 1) {
      const bounds = L.latLngBounds(route);
      map.fitBounds(bounds, { padding: [36, 36], maxZoom: country.zoom });
    } else {
      map.setView(country.center, country.zoom);
    }
  }, [activeStopId, country, onSelectStop]);

  useEffect(() => {
    const map = mapRef.current;
    const activeStop = country.routeStops.find((stop) => stop.id === activeStopId);
    if (!map || !activeStop) return;
    map.flyTo(activeStop.coordinates, Math.max(country.zoom, 7), {
      animate: true,
      duration: 0.65,
    });
  }, [activeStopId, country]);

  return (
    <div className="map-stage">
      <div className="map-meta">
        <span>{country.routeSummary}</span>
        <strong>最佳季节：{country.season}</strong>
      </div>
      {country.routeStops.length === 0 ? (
        <div className="empty-map-hint">
          <strong>还没有城市</strong>
          <span>在右侧添加你想去的第一个城市，地图会自动生成路线。</span>
        </div>
      ) : null}
      <div className="map-canvas" ref={mapElementRef} />
    </div>
  );
}
