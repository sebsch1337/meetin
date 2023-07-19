import { useState } from "react";

import { Button, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function AddMemberForm() {
  const form = useForm({
    initialValues: {
      email: "",
      role: null,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Ungültige E-Mail Adresse"),
      role: (value) => (value ? null : "Bitte eine Rolle wählen"),
    },
  });

  const [invitedMembers, setInvitedMembers] = useState([]);

  return (
    <Stack spacing={"xs"}>
      <form onSubmit={form.onSubmit((values) => setInvitedMembers((prev): any => [...prev, values]))}>
        <Stack spacing={"xl"}>
          <TextInput placeholder={"max.mustermann@googlemail.com"} label={"E-Mail Adresse"} {...form.getInputProps("email")} />
          <Select
            label={"Rolle"}
            placeholder={"Rolle wählen"}
            withinPortal
            data={[
              { value: "admin", label: "Admin" },
              { value: "user", label: "Benutzer" },
            ]}
            {...form.getInputProps("role")}
          />
          <Button type={"submit"} mt={"md"} fullWidth>
            Einladen
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
