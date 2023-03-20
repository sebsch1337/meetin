import { useDebouncedValue } from "@mantine/hooks";

import { useForm } from "@mantine/form";
import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Group,
  MultiSelect,
  NumberInput,
  Select,
  TextInput,
  Text,
  Textarea,
  LoadingOverlay,
} from "@mantine/core";
import { useEffect, useState } from "react";
import FileDropzone from "../FileDropzone";
import { uploadImages } from "../../utils/upload";

export default function LocationForm({
  closeModal,
  createLocation,
}: {
  closeModal: any;
  createLocation: any;
}) {
  const form = useForm({
    initialValues: {
      name: "",
      road: "",
      houseNo: "",
      postcode: "",
      city: "",
      suburb: "",
      tel: "",
      description: "",
      latitude: "",
      longitude: "",
      infos: "",
      tags: [],
      maxCapacity: null,
      indoor: false,
      outdoor: false,
      noGo: false,
    },

    validate: {
      name: (value) => (value.length === 0 ? "Bitte gib der Location einen Namen" : null),
    },
  });

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [locations, setLocations] = useState([]);
  const [debouncedOptions] = useDebouncedValue(search, 200);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([
    { value: "Bar", label: "Bar" },
    { value: "Restaurant", label: "Restaurant" },
    { value: "Kneipe", label: "Kneipe" },
  ]);

  useEffect(() => {
    const getExternalLocation = async (searchString: string) => {
      const sanitizedSearchString = searchString.replaceAll(" ", "+");
      const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=de&addressdetails=1&q=${sanitizedSearchString}`;
      const response = await fetch(searchUrl);
      const result = await response.json();

      // const filteredLocations = result.filter((location: any) => location.address.amenity);
      const filteredLocations = result || [];
      setLocations(filteredLocations);
      setSearchResults(
        filteredLocations.map((location: any) => ({
          key: location.place_id,
          value: location.display_name,
          label: location.display_name,
        }))
      );
    };

    getExternalLocation(debouncedOptions);
  }, [debouncedOptions]);

  const setFormData = (location: any) => {
    if (location.length > 0) {
      const address = location[0].address;
      form.setValues({
        name: address.amenity || address.leisure,
        road: address.road || address.square,
        houseNo: address.house_number,
        postcode: address.postcode,
        city: address.city,
        suburb: address.suburb,
        // suburb: address.neighbourhood || address.quarter || address.industrial || address.suburb,
        latitude: location[0].lat,
        longitude: location[0].lon,
      });
    }
  };

  return (
    <Flex direction={"column"} gap={"md"}>
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <Select
        label="Suche"
        placeholder="Auf OpenStreetMap suchen"
        searchable
        data={searchResults}
        searchValue={search}
        onSearchChange={setSearch}
        withinPortal
        nothingFound="Keine Ergebnisse"
        spellCheck={false}
        clearable
        filter={(value) => value.toLowerCase().length > 0}
      />
      <Button variant={"light"} size={"sm"} color={"teal"} onClick={() => setFormData(locations)}>
        Daten übernehmen
      </Button>

      <Divider />

      <form
        onSubmit={form.onSubmit(async (values) => {
          setLoading(true);
          const imageUrls = await uploadImages(images);
          createLocation(values, imageUrls);
          setLoading(false);
          closeModal();
        })}
      >
        <Flex direction={"column"} gap={"md"}>
          <TextInput
            withAsterisk
            label="Name"
            placeholder="Name der Location"
            spellCheck={false}
            {...form.getInputProps("name")}
          />
          <Group grow>
            <TextInput
              label="Straße"
              placeholder="Straße"
              spellCheck={false}
              {...form.getInputProps("road")}
            />
            <TextInput
              label="Hausnummer"
              placeholder="Hausnummer"
              spellCheck={false}
              {...form.getInputProps("houseNo")}
            />
          </Group>
          <Group grow>
            <TextInput
              label="Postleitzahl"
              placeholder="Postleitzahl"
              spellCheck={false}
              {...form.getInputProps("postcode")}
            />
            <TextInput label="Ort" placeholder="Ort" spellCheck={false} {...form.getInputProps("city")} />
          </Group>
          <Group grow>
            <TextInput
              label="Stadtteil"
              placeholder="Stadtteil"
              spellCheck={false}
              {...form.getInputProps("suburb")}
            />
            <TextInput
              label="Telefonnummer"
              placeholder="Telefonnummer"
              spellCheck={false}
              {...form.getInputProps("tel")}
            />
          </Group>
          <Group grow>
            <TextInput label="Breitengrad" placeholder="10.2931062" {...form.getInputProps("latitude")} />
            <TextInput label="Längengrad" placeholder="123.9020773" {...form.getInputProps("longitude")} />
          </Group>

          <Divider />

          <Group grow>
            <Flex direction={"column"}>
              <Text size={"sm"} weight={500}>
                Lokalität
              </Text>
              <Group mt="xs">
                <Checkbox label="Indoor" {...form.getInputProps("indoor", { type: "checkbox" })} />
                <Checkbox label="Outdoor" {...form.getInputProps("outdoor", { type: "checkbox" })} />
              </Group>
            </Flex>

            <NumberInput
              label="Max. Besucher"
              placeholder="Anzahl Besucher"
              spellCheck={false}
              {...form.getInputProps("maxCapacity")}
            />
          </Group>

          <Divider />

          <Textarea
            autosize
            label="Beschreibung"
            placeholder="Beschreibung, Lage, Anreise, Preisklasse, Menü"
            spellCheck={false}
            {...form.getInputProps("description")}
          />

          <Textarea
            autosize
            label="Interne Informationen"
            placeholder="Wichtige Hinweise für die Orga"
            spellCheck={false}
            {...form.getInputProps("infos")}
          />

          <MultiSelect
            label="Tags"
            data={tags}
            placeholder="Tags hinzufügen"
            searchable
            creatable
            getCreateLabel={(query) => `+ Erstelle ${query}`}
            onCreate={(query) => {
              const item = { value: query, label: query };
              setTags((current) => [...current, item]);
              console.log(tags);
              return item;
            }}
            {...form.getInputProps("tags")}
          />

          <Divider />

          <FileDropzone images={images} setImages={setImages} {...form.getInputProps("images")} />

          <Group position="right">
            <Button type="submit" variant={"light"} size={"sm"} color={"teal"}>
              Erstellen
            </Button>
          </Group>
        </Flex>
      </form>
    </Flex>
  );
}
