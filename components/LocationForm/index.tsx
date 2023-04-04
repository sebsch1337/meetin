import { useDebouncedValue, useNetwork } from "@mantine/hooks";

import { useSetAtom } from "jotai";
import { locationsAtom, modalAtom } from "@/store";

import { notifications } from "@mantine/notifications";

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
  Space,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { IconCheck } from "@tabler/icons-react";
import { createLocation, editLocation } from "@/lib/location";

export default function LocationForm({
  closeModal,
  editLocationMode,
  preValues,
}: {
  closeModal: any;
  editLocationMode: boolean;
  preValues: any;
}) {
  const setLocations = useSetAtom(locationsAtom);
  const setModal = useSetAtom(modalAtom);

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
  const [searchLocations, setSearchLocations] = useState([]);
  const [debouncedOptions] = useDebouncedValue(search, 200);
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
          setSearchLocations(filteredLocations);
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
      <Button variant={"light"} size={"sm"} color={"teal"} onClick={() => setFormData(searchLocations)}>
        Daten übernehmen
      </Button>

      <Divider />

      <form
        onSubmit={form.onSubmit(async (values) => {
          setLoading(true);
          if (editLocationMode) {
            editLocation(values, preValues.id, setLocations);
            notifications.show({
              icon: <IconCheck />,
              title: values.name,
              message: `Eintrag erfolgreich bearbeitet.`,
            });
          } else {
            createLocation(values, setLocations);
            notifications.show({
              icon: <IconCheck />,
              title: values.name,
              message: `Eintrag erfolgreich erstellt.`,
            });
          }
          form.reset();
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
              setTags((currentTags: any) => [...currentTags, item]);
              return item;
            }}
            {...form.getInputProps("tags")}
          />
          <Space />
          <Button type="submit" variant={"light"} size={"sm"} color={"teal"} fullWidth>
            {editLocationMode ? "Änderungen speichern" : "Location erstellen"}
          </Button>
          {editLocationMode && (
            <>
              {" "}
              <Divider />
              <Button
                variant={"light"}
                size={"sm"}
                color={"red"}
                fullWidth
                onClick={() => {
                  setModal((prev) => ({
                    ...prev,
                    title: "Location löschen",
                    type: "deleteLocation",
                    locationId: preValues.id,
                  }));
                }}
              >
                Location löschen
              </Button>
            </>
          )}
        </Flex>
      </form>
    </Flex>
  );
}
