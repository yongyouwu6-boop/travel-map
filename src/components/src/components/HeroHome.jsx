export default function HeroHome({ country, activeStop, onExplore }) {
  return (
    <main className="home-page">
      <section
        className="hero"
        style={{ "--hero-image": `url(${country.heroImage})` }}
      >
        <nav className="hero-nav" aria-label="站点导航">
          <span className="brand-lockup">
            <span className="brand-mark">FR</span>
            Route Atlas
          </span>
          <button type="button" className="ghost-button" onClick={onExplore}>
            查看地图
          </button>
        </nav>

        <div className="hero-copy">
          <p className="eyebrow">Build Your Own Route</p>
          <h1>自己规划{country.countryName}旅行路线</h1>
          <p className="hero-subtitle">{country.subtitle}</p>
          <div className="hero-actions">
            <button type="button" className="primary-button" onClick={onExplore}>
              开始探索路线
            </button>
            <span className="route-stat">{country.routeSummary}</span>
          </div>
        </div>
      </section>

      <section className="route-preview" aria-label="路线预览">
        <div>
          <p className="section-kicker">Route Preview</p>
          <h2>
            {activeStop
              ? `从${activeStop.name}开始，一路把你的目的地串起来。`
              : "先添加你想去的城市，再让地图帮你把路线串起来。"}
          </h2>
        </div>
        <div className="preview-track">
          {country.routeStops.length ? (
            country.routeStops.slice(0, 6).map((stop, index) => (
              <span className="preview-stop" key={`${stop.id}-${index}`}>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
                {stop.name}
              </span>
            ))
          ) : (
            <span className="preview-stop empty-preview">
              <strong>01</strong>
              等你添加第一个城市
            </span>
          )}
        </div>
      </section>
    </main>
  );
}
