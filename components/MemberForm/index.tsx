import { Button, Loader, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";

import { createInvitation } from "@/lib/teamLib";

interface AddMemberFormProps {
  closeModal: Function;
  setInvitedEmails: React.Dispatch<React.SetStateAction<InvitedEmails[]>>;
}

export const AddMemberForm: React.FC<AddMemberFormProps> = ({ closeModal, setInvitedEmails }) => {
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

  const [buttonLoading, setButtonLoading] = useState(false);

  const onSubmitHandler = async (values: any) => {
    setButtonLoading(true);
    const newInvitations = await createInvitation(values.email, values.role);
    if (newInvitations) {
      setInvitedEmails(newInvitations);
    }
    setButtonLoading(false);
    closeModal();
  };

  return (
    <Stack spacing={"xs"}>
      <form onSubmit={form.onSubmit(onSubmitHandler)}>
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
          <Button type={"submit"} mt={"md"} fullWidth disabled={buttonLoading}>
            {buttonLoading ? <Loader size={"1.4rem"} /> : "Einladen"}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};
