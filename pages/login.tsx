import { Button, Center, Group, LoadingOverlay, Stack, Text } from "@mantine/core";
import { IconBrandGoogle, IconHeartHandshake } from "@tabler/icons-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function Login() {
  const { data: session } = useSession();

  const [visible, setVisible] = useState(false);

  return (
    <Center mx={"auto"} h={"100vh"}>
      <LoadingOverlay visible={visible} overlayBlur={2} />

      <Stack align={"center"}>
        <Group spacing={"xs"}>
          <IconHeartHandshake size={"4rem"} />
          <Text size={"2rem"}>MeetIn</Text>
        </Group>
        {!session ? (
          <Button
            color={"red"}
            leftIcon={<IconBrandGoogle />}
            onClick={() => {
              setVisible(true);
              signIn("google", { callbackUrl: "/" });
            }}
          >
            Anmelden mit Google
          </Button>
        ) : (
          <Button
            leftIcon={<IconBrandGoogle />}
            onClick={() => {
              setVisible(true);
              signOut();
            }}
          >
            {session?.user?.name} abmelden
          </Button>
        )}
      </Stack>
    </Center>
  );
}
