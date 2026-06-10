import AddCityForm from "./AddCityForm.jsx";

export default function DestinationPanel({
  country,
  activeStop,
  guide,
  onSelectStop,
  onAddCity,
  onResetCustomCities,
  hasCustomCities,
}) {
  return (
    <aside className="destination-panel" aria-label="旅行城市规划">
      <div className="panel-scroll">
        {activeStop && guide ? (
          <>
            <div className="panel-header">
              <p className="section-kicker">{activeStop.region}</p>
              <h2>{activeStop.name}</h2>
              <span className="pill">{activeStop.days}</span>
            </div>

            <p className="intro-text">{guide.intro}</p>

            <section className="guide-section">
              <h3>推荐亮点</h3>
              <div className="highlight-grid">
                {guide.highlights.length ? (
                  guide.highlights.map((item) => <span key={item}>{item}</span>)
                ) : (
                  <span>还没有填写亮点</span>
                )}
              </div>
            </section>

            <section className="guide-section">
              <h3>美食与体验</h3>
              {guide.food.length ? (
                <ul>
                  {guide.food.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="empty-copy">还没有填写美食或体验。</p>
              )}
            </section>

            <section className="guide-note">
              <h3>交通提示</h3>
              <p>{guide.transport}</p>
            </section>

            <section className="guide-note muted-note">
              <h3>实用备注</h3>
              <p>{guide.notes}</p>
            </section>
          </>
        ) : (
          <div className="empty-panel">
            <p className="section-kicker">{country.countryName}</p>
            <h2>从第一个城市开始</h2>
            <p>
              这里不再预设路线。你添加想去的城市后，地图会按添加顺序自动连线，并生成可点击的目的地攻略。
            </p>
          </div>
        )}

        <section className="stop-list" aria-label={`${country.countryName}路线站点`}>
          <div className="section-title-row">
            <h3>我的路线</h3>
            {hasCustomCities ? (
              <button className="text-button" type="button" onClick={onResetCustomCities}>
                清除全部
              </button>
            ) : null}
          </div>
          {country.routeStops.length ? (
            <div className="stop-buttons">
              {country.routeStops.map((stop, index) => (
                <button
                  type="button"
                  key={`${stop.id}-${index}`}
                  className={stop.id === activeStop?.id ? "stop-button active" : "stop-button"}
                  onClick={() => onSelectStop(stop.id)}
                >
                  <span>{index + 1}</span>
                  {stop.name}
                </button>
              ))}
            </div>
          ) : (
            <p className="empty-copy">还没有城市。先在下面添加一个目的地。</p>
          )}
        </section>

        <section className="add-city-section">
          <h3>添加城市</h3>
          <AddCityForm onAddCity={onAddCity} />
        </section>
      </div>
    </aside>
  );
}
