import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

export const getAllEvents = async (): Promise<any> => {
  const response = await fetch("/api/events", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }
};

export const createEvent = async (values: Event, setEvents: any) => {
  const response = await fetch("/api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  if (response.ok) {
    const data = await response.json();
    setEvents((prevEvents: any): any => [
      ...prevEvents,
      {
        id: data?._id,
        ...data,
      },
    ]);
    notifications.show({
      icon: <IconCheck />,
      color: "teal",
      title: values.name,
      message: `Event erfolgreich erstellt.`,
    });
  } else {
    notifications.show({
      icon: <IconX />,
      color: "red",
      title: values.name,
      message: `Fehler beim Erstellen des Events.`,
    });
  }
};
