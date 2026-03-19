declare module 'country-currency-map' {
  interface CountryData {
    currency: string;
    symbol: string;
    name: string;
  }

  interface CurrencyData {
    name: string;
    symbol: string;
    abbreviation: string;
  }

  export function getCountry(countryName: string): CountryData;
  export function getCurrency(currencyAbbreviation: string): CurrencyData;
  export function getCurrencyAbbreviation(countryName: string): string;
  export function formatCurrency(amount: string, currencyAbbreviation: string): string;
  export function formatLocaleCurrency(
    amount: number, 
    currencyAbbreviation: string, 
    options?: {
      autoFixed?: boolean;
      locale?: string;
      abbreviate?: boolean;
    }
  ): string;
  export function getCurrencyList(): CurrencyData[];
  export function getCurrencyAbbreviationFromName(currencyName: string): string;
  export function getCountryByAbbreviation(countryAbbreviation: string): CountryData;
}