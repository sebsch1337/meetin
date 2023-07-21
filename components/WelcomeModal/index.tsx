import { useState } from "react";
import { Button, Modal, Space, Text, Title } from "@mantine/core";
import WelcomeForm from "../WelcomeForm";
import WelcomeInvited from "../WelcomeInvited";
import { createTeam } from "@/lib/teamLib";

export default function WelcomeModal({
  session,
  invitedTeam,
  signOut,
  setShowWelcomeModal,
}: {
  session: any;
  invitedTeam: Team;
  signOut: any;
  setShowWelcomeModal: any;
}) {
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [invitationState, setInvitationState] = useState("");
  const [teamName, setTeamName] = useState("");

  const continueButtonHandler = async () => {
    if (invitationState !== "accepted") {
      const createdTeam = await createTeam(teamName);
      if (!createdTeam) return;
    }
    setShowWelcomeModal(false);
  };

  return (
    <Modal size={"xl"} opened={true} onClose={() => signOut()} title={"Benutzer einrichten"}>
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
        <WelcomeForm setButtonDisabled={setButtonDisabled} setTeamName={setTeamName} />
      )}

      <Space h="xl" />
      <Button disabled={buttonDisabled} fullWidth onClick={async () => await continueButtonHandler()}>
        Weiter
      </Button>
    </Modal>
  );
}
