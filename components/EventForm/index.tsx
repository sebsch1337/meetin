import { useState } from "react";
import { useForm } from "@mantine/form";

import { createEvent, editEvent } from "@/lib/eventLib";

import {
  TextInput,
  Button,
  Select,
  Flex,
  Textarea,
  NumberInput,
  Divider,
  LoadingOverlay,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";

import { IconChecks, IconSpeakerphone, IconUsers } from "@tabler/icons-react";

export default function EventForm({
  event,
  setEvent,
  setEvents,
  locations,
  modal,
  setModal,
  closeModal,
}: {
  event?: Event;
  setEvent?: any;
  setEvents?: any;
  locations: Location[];
  modal?: Modal;
  setModal?: any;
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
      dateTime: event?.dateTime ? new Date(event?.dateTime) : null,
      going: event?.going ?? null,
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
      going: (value) => (Number(value) > 999 ? "Max 999 Besucher erlaubt" : null),
      announced: (value) => (Number(value) > 999 ? "Max 999 Besucher erlaubt" : null),
      visitors: (value) => (Number(value) > 999 ? "Max 999 Besucher erlaubt" : null),
      description: (value) => (value.length > 1000 ? "Zu viele Zeichen (Max. 1000)" : null),
      preNotes: (value) => (value.length > 1000 ? "Zu viele Zeichen (Max. 1000)" : null),
      postNotes: (value) => (value.length > 1000 ? "Zu viele Zeichen (Max. 1000)" : null),
      fbLink: (value) => (value.length > 100 ? "Zu viele Zeichen (Max. 100)" : null),
    },
  });

  const [loading, setLoading] = useState(false);

  return (
    <form
      onSubmit={form.onSubmit(async (values: any) => {
        setLoading(true);
        if (modal?.editMode) {
          if (event?.id) {
            try {
              const editedEvent = await editEvent(values, event.id);
              if (editedEvent.id) setEvent(editedEvent);
            } catch (e) {
              console.error(`Error while updating event`);
            }
          } else {
            console.error(`Can't find ID`);
          }
        } else {
          createEvent(values, setEvents);
        }
        closeModal();
      })}
    >
      <Flex direction={"column"} gap={"md"}>
        <LoadingOverlay visible={loading} overlayBlur={2} />
        <TextInput
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
          <NumberInput
            icon={<IconChecks size={16} />}
            label="Zugesagt"
            placeholder="Anzahl"
            max={999}
            maxLength={3}
            hideControls
            {...form.getInputProps("going")}
          />

          <NumberInput
            icon={<IconSpeakerphone size={16} />}
            label="Angekündigt"
            placeholder="Anzahl"
            max={999}
            maxLength={3}
            hideControls
            {...form.getInputProps("announced")}
          />

          <NumberInput
            icon={<IconUsers size={16} />}
            label="Erschienen"
            placeholder="Anzahl"
            max={999}
            maxLength={3}
            hideControls
            {...form.getInputProps("visitors")}
          />
        </Flex>

        <Textarea
          placeholder="Informationen zur Planung"
          label="Notizen"
          maxLength={1000}
          {...form.getInputProps("preNotes")}
        />

        <Textarea
          placeholder="Fazit nach dem Stammtisch"
          label="Fazit"
          maxLength={1000}
          {...form.getInputProps("postNotes")}
        />

        <TextInput
          label="Facebook Link"
          maxLength={100}
          placeholder="Link zum Facebook Event"
          {...form.getInputProps("fbLink")}
        />

        <Button type="submit" variant={"light"} color={"cyan"} size={"sm"} fullWidth>
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
              Event löschen
            </Button>
          </>
        )}
      </Flex>
    </form>
  );
}
