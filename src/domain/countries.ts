// Source:
// Countries with long/lat => https://developers.google.com/public-data/docs/canonical/countries_csv
// Countries images => https://github.com/djaiss/mapsicon

import { countries } from "./countries.position";
import { frenchCountryNames } from "./countries.name.fr";
import { hungarianCountryNames } from "./countries.name.hu";
import { dutchCountryNames } from "./countries.name.nl";
import { countryCodesWithImage } from "./countries.image";

export interface Country {
  code: string;
  latitude: number;
  longitude: number;
  name: string;
}

export const countriesWithImage = countries.filter((c) =>
  countryCodesWithImage.includes(c.code.toLowerCase())
);

export function getCountryName(language: string, country: Country) {
  switch (language) {
    case "fr":
      return frenchCountryNames[country.code];
    case "hu":
      return hungarianCountryNames[country.code];
    case "nl":
      return dutchCountryNames[country.code];
    default:
      return country.name;
  }
}

export function sanitizeCountryName(countryName: string): string {
  return countryName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[- '()]/g, "")
    .toLowerCase();
}
