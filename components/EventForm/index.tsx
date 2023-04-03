import { TextInput, Button, Group, Select, Flex, Textarea, NumberInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";

import { useForm } from "@mantine/form";

export default function EventForm({
  addEventToDb,
  locations,
  closeModal,
}: {
  addEventToDb: any;
  locations: Location[];
  closeModal: any;
}) {
  const locationData = locations.map((location): { value: string; label: string } => ({
    value: location.id,
    label: location.name,
  }));

  const form = useForm({
    initialValues: {
      name: "Stammtisch ",
      location: "",
      dateTime: null,
      announced: null,
      visitors: null,
      preNotes: "",
      postNotes: "",
      fbLink: "",
    },

    validate: {
      name: (value) => (value.length === 0 ? "Bitte gib der Veranstaltung einen Namen" : null),
      location: (value) => (value.length === 0 ? "Bitte wähle eine Location" : null),
      dateTime: (value) => (value === null ? "Bitte wähle einen Zeitpunkt" : null),
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        addEventToDb(values);
        closeModal();
      })}
    >
      <Flex direction={"column"} gap={"md"}>
        <TextInput
          data-autofocus
          withAsterisk
          label="Name"
          placeholder="Stammtisch 01/2023"
          {...form.getInputProps("name")}
        />

        <Select
          withAsterisk
          label="Location"
          placeholder="Location wählen"
          searchable
          nothingFound="Nichts gefunden"
          data={locationData}
          {...form.getInputProps("location")}
        />

        <DateTimePicker
          withAsterisk
          label="Datum und Uhrzeit"
          placeholder="Datum / Uhrzeit wählen"
          popoverProps={{ withinPortal: true }}
          {...form.getInputProps("dateTime")}
        />
        <Flex gap={"xs"}>
          <NumberInput label="Angekündigt" placeholder="Anzahl" {...form.getInputProps("announced")} />

          <NumberInput label="Erschienen" placeholder="Anzahl" {...form.getInputProps("visitors")} />
        </Flex>

        <Textarea
          placeholder="Informationen zur Planung"
          label="Notizen"
          {...form.getInputProps("preNotes")}
        />

        <Textarea
          placeholder="Hinweise zum Stammtisch"
          label="Hinweise"
          {...form.getInputProps("postNotes")}
        />

        <TextInput
          label="Facebook Link"
          placeholder="Link zum Facebook Event"
          {...form.getInputProps("fbLink")}
        />

        <Group position="right">
          <Button type="submit">Erstellen</Button>
        </Group>
      </Flex>
    </form>
  );
}
