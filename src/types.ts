export interface Modifier {
  code: string;
  displayText: string;
}

export interface DimensionItem {
  code: string;
  name: string;
  icon: string;
  modifiers?: Modifier[];
  children?: DimensionItem[];
}

export interface SelectedItems {
  [level: number]: string;
}

export interface ModifierValues {
  [level: number]: {
    [modifierCode: string]:
      | string
      | number
      | { startDate: string; endDate: string };
  };
}

export interface SubNavItem {
  name: string;
  path: string;
}

export interface Brand {
  name: string;
  logo: string;
  subItems: SubNavItem[];
}
