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
  defaultValue: [
    {
      id: "k543",
      name: "Wenkers am Markt",
      address: {
        houseNo: "1",
        road: "Betenstrasse",
        suburb: "Innenstadt West",
        city: "Dortmund",
        postcode: "44137",
      },
      description: "Alte Dortmunder Traditionskneipe mit leckerem Bier und gutem Essen.",
      infos: "Eher teuer. Macht keine Deckel! Am besten 3 Wochen im Voraus reservieren.",
      tags: ["Restaurant", "Biergarten", "Bar", "Outdoor", "Indoor"],
      maxCapacity: 60,
      indoor: true,
      outdoor: true,
      noGo: true,
      images: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
        "https://images.unsplash.com/photo-1594747458008-0a70f1c213e6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1775&q=80",
      ],
    },
    {
      id: "ep30",
      name: "Rock Cafe",
      address: {
        houseNo: "21",
        road: "Reinoldistraße",
        suburb: "Innenstadt West",
        city: "Dortmund",
        postcode: "44135",
      },
      description: "Ungezwungener Treffpunkt mit Rockmusik, Sport-TV und Kicker.",
      infos: "Hier gibts Astra!",
      tags: ["Kneipe", "Bar", "Kicker", "Fußball"],
      maxCapacity: 20,
      indoor: true,
      outdoor: true,
      noGo: false,
      images: [
        "https://images.unsplash.com/photo-1636067518443-4c59b8e80e43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=830&q=80",
        "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1772&q=80",
      ],
    },
  ],
};
