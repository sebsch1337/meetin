import { acceptInvitation, declineInvitation } from "@/lib/teamLib";
import { Blockquote, Button, Group, Text } from "@mantine/core";
import { IconComet } from "@tabler/icons-react";

interface WelcomeInvitedProps {
  eMail: string;
  invitedTeam: Team;
  setButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setInvitationState: React.Dispatch<React.SetStateAction<string>>;
}

export const WelcomeInvited: React.FC<WelcomeInvitedProps> = ({ eMail, invitedTeam, setButtonDisabled, setInvitationState }) => {
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
          onClick={async () => {
            setButtonDisabled(false);
            setInvitationState("accepted");
            await acceptInvitation();
          }}
        >
          Einladung annehmen
        </Button>
        <Button
          size="xs"
          fullWidth
          variant="outline"
          onClick={() => {
            setButtonDisabled(false);
            declineInvitation(eMail);
            setInvitationState("declined");
          }}
        >
          Einladung ablehnen
        </Button>
      </Group>
    </Blockquote>
  );
};
