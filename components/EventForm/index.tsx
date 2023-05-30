import { createEvent } from "@/lib/eventLib";
import { TextInput, Button, Select, Flex, Textarea, NumberInput, Divider } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";

import { useForm } from "@mantine/form";

export default function EventForm({
  event,
  setEvent,
  setEvents,
  locations,
  modal,
  setModal,
  closeModal,
}: {
  event: Event;
  setEvent: any;
  setEvents: any;
  locations: Location[];
  modal: Modal;
  setModal: any;
  closeModal: any;
}) {
  const locationData = locations.map((location): { value: string; label: string } => ({
    value: location?.id || "",
    label: location?.name || "",
  }));

  const form = useForm({
    initialValues: {
      name: event?.name ?? "Stammtisch ",
      locationId: event?.locationId ?? "",
      dateTime: new Date(event?.dateTime) ?? null,
      announced: event?.announced ?? null,
      visitors: event?.visitors ?? null,
      description: event?.description ?? "",
      preNotes: event?.preNotes ?? "",
      postNotes: event?.postNotes ?? "",
      fbLink: event?.fbLink ?? "",
    },

    validate: {
      name: (value) => (value.length === 0 ? "Bitte gib der Veranstaltung einen Namen" : null),
      locationId: (value) => (value.length === 0 ? "Bitte wähle eine Location" : null),
      dateTime: (value) => (value === null ? "Bitte wähle einen Zeitpunkt" : null),
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values: any) => {
        if (modal.editMode) {
        } else {
          createEvent(values, setEvents);
        }
        closeModal();
      })}
    >
      <Flex direction={"column"} gap={"md"}>
        <TextInput
          data-autofocus
          withAsterisk
          label="Name"
          maxLength={50}
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
          spellCheck={false}
          {...form.getInputProps("locationId")}
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
          maxLength={1000}
          {...form.getInputProps("preNotes")}
        />

        <Textarea
          placeholder="Hinweise zum Stammtisch"
          label="Hinweise"
          maxLength={1000}
          {...form.getInputProps("postNotes")}
        />

        <TextInput
          label="Facebook Link"
          maxLength={100}
          placeholder="Link zum Facebook Event"
          {...form.getInputProps("fbLink")}
        />

        <Button type="submit" variant={"light"} size={"sm"} color={"teal"} fullWidth>
          {modal?.editMode ? "Änderungen speichern" : "Event erstellen"}
        </Button>
        {modal?.editMode && (
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
                  title: "Event löschen",
                  type: "delete",
                }));
              }}
            >
              Location löschen
            </Button>{" "}
          </>
        )}
      </Flex>
    </form>
  );
}
