import { Button, LoadingOverlay, Space, Stack, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";

interface DeleteTeamModalProps {
  team: Team;
  deleteTeam: (teamId: string) => Promise<boolean>;
  signOut: () => void;
}

export const DeleteTeamModal: React.FC<DeleteTeamModalProps> = ({ team, deleteTeam, signOut }) => {
  const [visible, setVisible] = useState(false);

  const deleteTeamHandler = async () => {
    setVisible(true);
    const teamDeleted = team?.id ? await deleteTeam(team.id) : false;
    if (!teamDeleted) {
      setVisible(false);
      return;
    }
    signOut();
  };
  return (
    <Stack spacing={"xs"}>
      <LoadingOverlay visible={visible} />
      <Text>Möchtest du {team.name} endgültig löschen?</Text>
      <Text>Nach dem Löschen wirst du automatisch abgemeldet.</Text>
      <Space h={"md"} />
      <Button color={"red"} leftIcon={<IconTrash size="1.2rem" />} onClick={deleteTeamHandler}>
        Team löschen
      </Button>
    </Stack>
  );
};
