import { Button, Center, Group, LoadingOverlay, Stack, Text } from "@mantine/core";
import { IconBrandFacebook, IconHeartHandshake } from "@tabler/icons-react";
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
            leftIcon={<IconBrandFacebook />}
            onClick={() => {
              setVisible(true);
              signIn("facebook", { callbackUrl: "/" });
            }}
          >
            Anmelden mit Facebook
          </Button>
        ) : (
          <Button
            leftIcon={<IconBrandFacebook />}
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
