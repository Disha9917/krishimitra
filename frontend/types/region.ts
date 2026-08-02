export interface District {
  id: string;             // slug, e.g. "banaskantha"
  name: string;           // display name, e.g. "Banaskantha"
  nameGujarati: string;   // Gujarati translation, e.g. "બનાસકાંઠા"
  regionId: string;       // FK to Region ID
  defaultPincode?: string;
}

export interface Region {
  id: string;             // slug, e.g. "north-gujarat"
  name: string;           // display name, e.g. "North Gujarat"
  nameGujarati: string;   // Gujarati display name, e.g. "ઉત્તર ગુજરાત"
  districtCount: number;
  districts: District[];
}
