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
  Modal,
} from "@mantine/core";

import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useSetAtom } from "jotai";
import { locationsAtom, modalAtom, tagsAtom } from "@/store";
import { useEffect, useState } from "react";
import { createLocation, deleteLocation, editLocation, searchExternalLocation } from "@/lib/locationLib";
import { LocationDeleteModal } from "../LocationDeleteModal";

export default function LocationForm({
  closeModal,
  editLocationMode,
  preValues,
  tags = [],
  setLocation,
  setModal,
}: {
  closeModal: any;
  editLocationMode: boolean;
  preValues: any;
  tags?: Tag[];
  setLocation?: any;
  setModal?: any;
}) {
  const setLocations = useSetAtom(locationsAtom);

  const [loading, setLoading] = useState(false);

  const [searchString, setSearchString] = useState("");
  const [searchLocations, setSearchLocations] = useState([]);
  const [debouncedSearchString] = useDebouncedValue(searchString, 200);

  useEffect(() => {
    const fetchExternalLocation = async (searchString: string) => {
      if (searchString.length > 0) {
        try {
          const externalLocation = await searchExternalLocation(searchString);
          setSearchLocations(externalLocation);
        } catch (e) {
          console.error(e);
          return e;
        }
      }
    };

    fetchExternalLocation(debouncedSearchString);
  }, [debouncedSearchString]);

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

  const setFormData = (location: any) => {
    if (location.length > 0) {
      const address = location[0]?.address;
      form.setValues({
        name: address?.amenity || address?.leisure,
        road: address?.road || address?.square,
        houseNo: address?.house_number,
        postcode: address?.postcode,
        city: address?.city,
        suburb: address?.suburb,
        latitude: location[0]?.lat,
        longitude: location[0]?.lon,
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
        data={searchLocations.map((location: any) => ({
          key: location.place_id,
          value: location.display_name,
          label: location.display_name,
        }))}
        searchValue={searchString}
        onSearchChange={setSearchString}
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
            await editLocation({ ...values, images: [...preValues.images] }, preValues.id, setLocation);
          } else {
            await createLocation(values, setLocations);
          }
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
            maxLength={50}
          />
          <Group grow>
            <TextInput
              label="Straße"
              placeholder="Straße"
              spellCheck={false}
              {...form.getInputProps("road")}
              maxLength={100}
            />
            <TextInput
              label="Hausnummer"
              placeholder="Hausnummer"
              spellCheck={false}
              {...form.getInputProps("houseNo")}
              maxLength={5}
            />
          </Group>
          <Group grow>
            <TextInput
              label="Postleitzahl"
              placeholder="Postleitzahl"
              spellCheck={false}
              {...form.getInputProps("postcode")}
              maxLength={7}
            />
            <TextInput
              label="Ort"
              placeholder="Ort"
              spellCheck={false}
              {...form.getInputProps("city")}
              maxLength={100}
            />
          </Group>
          <Group grow>
            <TextInput
              label="Stadtteil"
              placeholder="Stadtteil"
              spellCheck={false}
              {...form.getInputProps("suburb")}
              maxLength={100}
            />
            <TextInput
              label="Telefonnummer"
              placeholder="Telefonnummer"
              spellCheck={false}
              {...form.getInputProps("tel")}
              maxLength={20}
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
              max={999}
              min={0}
            />
          </Group>

          <Divider />

          <Textarea
            autosize
            label="Beschreibung"
            placeholder="Beschreibung, Lage, Anreise, Preisklasse, Menü"
            spellCheck={false}
            {...form.getInputProps("description")}
            maxLength={1000}
          />

          <Textarea
            autosize
            label="Interne Informationen"
            placeholder="Wichtige Hinweise für die Orga"
            spellCheck={false}
            {...form.getInputProps("infos")}
            maxLength={1000}
          />

          <MultiSelect
            label="Tags"
            data={tags?.map((tag: any) => ({ value: tag.id, label: tag.name })) || []}
            placeholder="Max. 6 Tags hinzufügen"
            searchable
            creatable={false}
            maxSelectedValues={6}
            {...form.getInputProps("tags")}
          />
          <Space />
          <Button type="submit" variant={"light"} size={"sm"} color={"teal"} fullWidth>
            {editLocationMode ? "Änderungen speichern" : "Location erstellen"}
          </Button>
          {editLocationMode && (
            <>
              <Divider />
              <Button
                variant={"light"}
                size={"sm"}
                color={"red"}
                fullWidth
                onClick={() => {
                  setModal((prev: any) => ({
                    ...prev,
                    title: "Location löschen",
                    type: "deleteLocation",
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
