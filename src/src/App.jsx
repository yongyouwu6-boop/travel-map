import { useEffect, useMemo, useState } from "react";
import { countries } from "./data/countries.js";
import HeroHome from "./components/HeroHome.jsx";
import CountrySwitcher from "./components/CountrySwitcher.jsx";
import DestinationPanel from "./components/DestinationPanel.jsx";
import TravelMap from "./components/TravelMap.jsx";

const CUSTOM_DATA_KEY = "route-atlas-custom-cities";

function readCustomData() {
  try {
    return JSON.parse(window.localStorage.getItem(CUSTOM_DATA_KEY)) ?? {};
  } catch {
    return {};
  }
}

function applyCustomCities(country, customCountryData) {
  if (!customCountryData?.stops?.length) return country;

  const routeStops = [...country.routeStops, ...customCountryData.stops];

  return {
    ...country,
    routeSummary: `${routeStops.length}个自选城市 · 按你的顺序生成路线`,
    routeStops,
    guides: {
      ...country.guides,
      ...customCountryData.guides,
    },
  };
}

export default function App() {
  const [view, setView] = useState("home");
  const [countryId, setCountryId] = useState("france");
  const [customData, setCustomData] = useState(readCustomData);
  const editableCountries = useMemo(() => {
    return countries.map((countryItem) =>
      applyCustomCities(countryItem, customData[countryItem.id])
    );
  }, [customData]);
  const country = editableCountries.find((item) => item.id === countryId) ?? editableCountries[0];
  const [activeStopId, setActiveStopId] = useState(country.routeStops[0]?.id ?? null);

  const activeStop = useMemo(() => {
    return country.routeStops.find((stop) => stop.id === activeStopId) ?? country.routeStops[0] ?? null;
  }, [activeStopId, country]);

  const activeGuide = activeStop ? country.guides[activeStop.guideId ?? activeStop.id] ?? {
    intro: "这个城市还没有详细攻略。",
    highlights: [],
    food: [],
    transport: "可以在添加城市表单里补充交通提示。",
    notes: "可以继续完善这条自定义路线。",
  } : null;

  useEffect(() => {
    window.localStorage.setItem(CUSTOM_DATA_KEY, JSON.stringify(customData));
  }, [customData]);

  function handleCountryChange(nextCountryId) {
    const nextCountry = editableCountries.find((item) => item.id === nextCountryId);
    if (!nextCountry) return;
    setCountryId(nextCountryId);
    setActiveStopId(nextCountry.routeStops[0]?.id ?? null);
    setView("map");
  }

  function handleAddCity(city) {
    const cityId = `custom-${Date.now()}`;
    const nextStop = {
      id: cityId,
      name: city.name,
      region: city.region,
      coordinates: [city.latitude, city.longitude],
      days: city.days,
      isCustom: true,
    };
    const nextGuide = {
      intro: city.intro,
      highlights: city.highlights,
      food: city.food,
      transport: city.transport,
      notes: city.notes,
    };

    setCustomData((currentData) => {
      const currentCountryData = currentData[country.id] ?? { stops: [], guides: {} };
      return {
        ...currentData,
        [country.id]: {
          stops: [...currentCountryData.stops, nextStop],
          guides: {
            ...currentCountryData.guides,
            [cityId]: nextGuide,
          },
        },
      };
    });
    setActiveStopId(cityId);
    setView("map");
  }

  function handleResetCustomCities() {
    setCustomData((currentData) => {
      const nextData = { ...currentData };
      delete nextData[country.id];
      return nextData;
    });
    setActiveStopId(null);
  }

  if (view === "home") {
    return (
      <HeroHome
        country={country}
        activeStop={activeStop}
        onExplore={() => setView("map")}
      />
    );
  }

  return (
    <main className="route-shell">
      <header className="topbar">
        <button className="brand-button" type="button" onClick={() => setView("home")}>
          <span className="brand-mark">FR</span>
          <span>
            <strong>Route Atlas</strong>
            <small>{country.countryName}</small>
          </span>
        </button>
        <CountrySwitcher
          countries={editableCountries}
          currentCountryId={countryId}
          onChange={handleCountryChange}
        />
      </header>

      <section className="map-workspace" aria-label={`${country.countryName}旅游路线地图`}>
        <TravelMap
          country={country}
          activeStopId={activeStop?.id ?? null}
          onSelectStop={setActiveStopId}
        />
        <DestinationPanel
          country={country}
          activeStop={activeStop}
          guide={activeGuide}
          onSelectStop={setActiveStopId}
          onAddCity={handleAddCity}
          onResetCustomCities={handleResetCustomCities}
          hasCustomCities={Boolean(customData[country.id]?.stops?.length)}
        />
      </section>
    </main>
  );
}
