export interface Region {
  name: string;
  code: string;
  flag: string;
}

export interface Outlet {
  id: string;
  name: string;
  regions: Region[];
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  outlets: Outlet[];
}

export interface BrandChooseType {
  brandName: string;
  outlets: string[];
  selectedAllBrandWiseOutlets: { brandName: string; outlets: string[] }[];
  multiSelectedBrands?: string[];
}

// Define a Country type
export interface Country {
  name: string;
  flag: string; // Example: "🌍" or "KW"
  code: string; // Example: "all", "KW", "BH", "KSA", etc.
  currencyCode: string; // Example: "KWD", "SAR", "N/A"
}

// Define an Outlet type
export interface OutletType {
  name: string; // Example: "% Avenues Kuwait"
  countries: Country[]; // List of countries available for that outlet
}

// Define a Brand type
export interface BrandType {
  name: string; // Example: "% ΔRΔBICΔ" or "All"
  logo: string; // Path to logo image
  outlets: OutletType[] | null; // Null for "All", array otherwise
}

// Define the top-level structure (array of brands)
export type BrandData = BrandType[];
