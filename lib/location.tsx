import { nanoid } from "nanoid";

export const createLocation = (values: any, setLocations: any) => {
  setLocations((prevLocations: any): any => [
    ...prevLocations,
    {
      id: nanoid(4),
      name: values?.name,
      address: {
        road: values?.road,
        houseNo: values?.houseNo,
        postcode: values?.postcode,
        city: values?.city,
        suburb: values?.suburb,
      },
      description: values?.description,
      infos: values?.infos,
      tel: values?.tel,
      tags: values?.tags,
      maxCapacity: values?.maxCapacity,
      indoor: values?.indoor,
      outdoor: values?.outdoor,
      noGo: values?.noGo,
      images: [],
      latitude: values?.latitude,
      longitude: values?.longitude,
    },
  ]);
};

export const editLocation = (values: any, locationId: string, setLocations: any) =>
  setLocations((prevLocations: any) => {
    const locationToChange: any = prevLocations?.find((location: any) => location.id === locationId);
    locationToChange.name = values?.name;
    locationToChange.address.road = values?.road;
    locationToChange.address.houseNo = values?.houseNo;
    locationToChange.address.postcode = values?.postcode;
    locationToChange.address.city = values?.city;
    locationToChange.address.suburb = values?.suburb;
    locationToChange.description = values?.description;
    locationToChange.infos = values?.infos;
    locationToChange.tel = values?.tel;
    locationToChange.tags = values?.tags;
    locationToChange.maxCapacity = values?.maxCapacity;
    locationToChange.indoor = values?.indoor;
    locationToChange.outdoor = values?.outdoor;
    locationToChange.noGo = values?.noGo;
    locationToChange.latitude = values?.latitude;
    locationToChange.longitude = values?.longitude;

    return prevLocations;
  });
