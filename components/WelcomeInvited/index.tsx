import { acceptInvitation } from "@/lib/teamLib";
import { Blockquote, Button, Group, Text } from "@mantine/core";
import { IconComet } from "@tabler/icons-react";

export default function WelcomeInvited({
  invitedTeam,
  setButtonDisabled,
  setInvitationState,
}: {
  invitedTeam: Team;
  setButtonDisabled: any;
  setInvitationState: any;
}) {
  return (
    <Blockquote p={"sm"} icon={<IconComet size={"2rem"} />}>
      <Text>
        Du wurdest zum Team
        <Text span fw={700}>
          {` ${invitedTeam?.name} `}
        </Text>
        eingeladen!
      </Text>
      <Group mt={"sm"}>
        <Button
          size="xs"
          fullWidth
          onClick={() => {
            setButtonDisabled(false);
            setInvitationState("accepted");
            acceptInvitation();
          }}
        >
          Einladung annehmen
        </Button>
        <Button
          size="xs"
          fullWidth
          variant="outline"
          onClick={() => {
            setInvitationState("declined");
          }}
        >
          Einladung ablehnen
        </Button>
      </Group>
    </Blockquote>
  );
}
