import { Button, Modal, Space, Text, Title } from "@mantine/core";
import WelcomeForm from "../WelcomeForm";
import { useState } from "react";
import WelcomeInvited from "../WelcomeInvited";

export default function WelcomeModal({ session, invitedTeam }: { session: any; invitedTeam: Team }) {
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [invitationState, setInvitationState] = useState("");

  return (
    <Modal size={"xl"} opened={true} onClose={() => {}} withCloseButton={false}>
      <Title>Willkommen bei MeetIn, {session?.user?.name?.split(" ")[0] || "Unbekannter"}!</Title>
      <Space h="md" />
      <Text>
        MeetIn hilft dir, den Überblick über deine Veranstaltungen und Lokationen zu behalten.
        <Space h="sm" />
        Hierzu kannst du im Menüpunk{" "}
        <Text span fw={700}>
          {` Locations `}
        </Text>
        deine Locations wie beispielsweise Restaurants oder Bars verwalten.
        <Space h="sm" />
        Unter
        <Text span fw={700}>
          {` Events `}
        </Text>
        kannst du dann Veranstaltungen mit allen nötigen Infos hinterlegen und nachträglich bearbeiten.
        <Space h="sm" />
      </Text>

      {invitedTeam && invitationState === "" ? (
        <WelcomeInvited invitedTeam={invitedTeam} setButtonDisabled={setButtonDisabled} setInvitationState={setInvitationState} />
      ) : invitationState === "accepted" ? (
        <Text>Einladung angenommen.</Text>
      ) : (
        <WelcomeForm setButtonDisabled={setButtonDisabled} />
      )}

      <Space h="xl" />
      <Button disabled={buttonDisabled} fullWidth>
        Weiter
      </Button>
    </Modal>
  );
}
