interface Address {
  road?: string;
  houseNo?: string;
  postcode?: string;
  city?: string;
  suburb?: string;
}

interface Location {
  _id?: string;
  id?: string;
  name?: string;
  address?: Address;
  description?: string;
  infos?: string;
  tel?: string;
  tags?: string[];
  maxCapacity?: number;
  indoor?: boolean;
  outdoor?: boolean;
  noGo?: boolean;
  latitude?: number;
  longitude?: number;
}

interface Images {
  publicId: string;
  url: string;
}
