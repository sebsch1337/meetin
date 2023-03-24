import { useDebouncedValue, useNetwork } from "@mantine/hooks";

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
import FileDropzone from "../PictureDropzone";
import { uploadImages } from "../../utils/upload";

export default function LocationForm({
  closeModal,
  createLocation,
  editLocation,
  preValues,
}: {
  closeModal: any;
  createLocation: any;
  editLocation: any;
  preValues: any;
}) {
  const form = useForm({
    initialValues: {
      name: preValues?.name || "",
      road: preValues?.address?.road || "",
      houseNo: preValues?.address?.houseNo || "",
      postcode: preValues?.address?.postcode || "",
      city: preValues?.address?.city || "",
      suburb: preValues?.address?.suburb || "",
      tel: preValues?.tel || "",
      description: preValues?.description || "",
      latitude: preValues?.latitude || "",
      longitude: preValues?.longitude || "",
      infos: preValues?.infos || "",
      tags: preValues?.tags || [],
      maxCapacity: preValues?.maxCapacity || null,
      indoor: preValues?.indoor || false,
      outdoor: preValues?.outdoor || false,
      noGo: preValues?.noGo || false,
    },

    validate: {
      name: (value) => (value?.length > 0 ? null : "Bitte gib der Location einen Namen"),
    },
  });

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [locations, setLocations] = useState([]);
  const [debouncedOptions] = useDebouncedValue(search, 200);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState(
    preValues?.tags?.map((tag: string[]) => ({ value: tag, label: tag })) || []
  );

  const networkStatus = useNetwork();

  useEffect(() => {
    const getExternalLocation = async (searchString: string) => {
      const sanitizedSearchString = searchString.replaceAll(" ", "+");
      if (sanitizedSearchString.length > 0 && networkStatus.online) {
        try {
          const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=de&addressdetails=1&q=${sanitizedSearchString}`;
          const response = await fetch(searchUrl);
          const result = await response.json();

          const filteredLocations = result || [];
          setLocations(filteredLocations);
          setSearchResults(
            filteredLocations.map((location: any) => ({
              key: location.place_id,
              value: location.display_name,
              label: location.display_name,
            }))
          );
        } catch (e) {
          console.error(e);
        }
      }
    };

    getExternalLocation(debouncedOptions);
  }, [debouncedOptions, networkStatus]);

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
          preValues?.name
            ? editLocation(values, preValues.id, imageUrls ?? preValues.images)
            : createLocation(values, imageUrls);
          setLoading(false);
          form.reset();
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
              setTags((currentTags: any) => [...currentTags, item]);
              return item;
            }}
            {...form.getInputProps("tags")}
          />

          <Divider />

          <FileDropzone images={images} setImages={setImages} {...form.getInputProps("images")} />

          <Group position="right">
            <Button type="submit" variant={"light"} size={"sm"} color={"teal"}>
              {preValues?.name ? "Speichern" : "Erstellen"}
            </Button>
          </Group>
        </Flex>
      </form>
    </Flex>
  );
}
