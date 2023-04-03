interface Location {
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

interface Address {
  city: string;
  houseNo: string;
  postcode: string;
  road: string;
  suburb: string;
}

interface Images {
  publicId: string;
  url: string;
}
