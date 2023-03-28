interface DbLocations {
  key: string;
  defaultValue: Location[];
}

export interface Location {
  id: string;
  name: string;
  address: Address;
  description: string;
  infos: string;
  tags: string[];
  maxCapacity: number;
  indoor: boolean;
  outdoor: boolean;
  noGo: boolean;
  images: Images[];
}

export interface Address {
  city: string;
  houseNo: string;
  postcode: string;
  road: string;
  suburb: string;
}

export interface Images {
  publicId: string;
  url: string;
}

export const dbLocations: DbLocations = {
  key: "dbLocations",
  defaultValue: [],
};
