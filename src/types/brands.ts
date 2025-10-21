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
