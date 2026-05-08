export const REST_OF_WORLD_COUNTRIES = ["Brazil", "Egypt", "Kenya", "Oman", "Tunisia", "Turkey"];
export const REST_OF_WORLD_FILTER_VALUE = "__rest-of-world";
export const REST_OF_WORLD_FILTER_LABEL = "Rest of the world";

export function expandCountryFilters(countries: string[]) {
  return countries.flatMap((country) => (country === REST_OF_WORLD_FILTER_VALUE ? REST_OF_WORLD_COUNTRIES : country));
}

export function countryFilterOptions(countries: string[]) {
  const hasRestOfWorld = countries.some((country) => REST_OF_WORLD_COUNTRIES.includes(country));
  const mainCountries = countries.filter((country) => !REST_OF_WORLD_COUNTRIES.includes(country));

  return [
    ...mainCountries.map((country) => ({ label: country, value: country })),
    ...(hasRestOfWorld ? [{ label: REST_OF_WORLD_FILTER_LABEL, value: REST_OF_WORLD_FILTER_VALUE }] : []),
  ];
}
