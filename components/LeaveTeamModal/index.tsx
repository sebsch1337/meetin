import { removeUserFromTeam } from "@/lib/teamLib";
import { Button, LoadingOverlay, Space, Stack, Text } from "@mantine/core";
import { IconDoorExit } from "@tabler/icons-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function LeaveTeamModal({ userId }: { userId: any }) {
  const [visible, setVisible] = useState(false);

  const leaveTeamHandler = async () => {
    setVisible(true);
    const userRemoved = await removeUserFromTeam(userId);
    if (!userRemoved) {
      setVisible(false);
      return;
    }
    signOut();
  };

  return (
    <Stack spacing={"xs"}>
      <LoadingOverlay visible={visible} />
      <Text>Möchtest du das Team endgültig verlassen?</Text>
      <Text>Du wirst automatisch abgemeldet.</Text>
      <Space h={"md"} />
      <Button color={"red"} leftIcon={<IconDoorExit size="1.2rem" />} onClick={leaveTeamHandler}>
        Team verlassen
      </Button>
    </Stack>
  );
}
