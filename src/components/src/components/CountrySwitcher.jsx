export default function CountrySwitcher({ countries, currentCountryId, onChange }) {
  return (
    <label className="country-switcher">
      <span>国家</span>
      <select value={currentCountryId} onChange={(event) => onChange(event.target.value)}>
        {countries.map((country) => (
          <option key={country.id} value={country.id}>
            {country.countryName}
          </option>
        ))}
      </select>
    </label>
  );
}
