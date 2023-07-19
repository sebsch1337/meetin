import { useState } from "react";

import { ActionIcon, Group, Menu, Paper, Stack, Text, Title, createStyles } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { IconTrashX, IconUser, IconUserShield } from "@tabler/icons-react";

export default function MemberCard() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const useStyles = createStyles((theme) => ({
    paper: {
      color: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  }));
  const { theme } = useStyles();

  const [invitedMembers, setInvitedMembers] = useState([
    { email: "4bst1n3nz@googlemail.com", role: "admin" },
    { email: "maximiliain.mustermann@googlemail.com", role: "user" },
  ]);

  return (
    <Paper miw={isMobile ? "100%" : "45%"} p={"md"} radius={"lg"} bg={theme.colorScheme === "dark" ? "dark.6" : "gray.0"}>
      <Stack spacing={"xs"}>
        <Title order={3} size={14}>
          Mitglieder verwalten
        </Title>

        {invitedMembers?.map((invitedMember: any) => (
          <Group key={invitedMember?.email} position="apart">
            <Text size={"sm"} w={isMobile ? "14rem" : "90%"} truncate>
              {invitedMember?.email}
            </Text>
            <Group>
              <Menu>
                <Menu.Target>
                  <ActionIcon size={"lg"} variant={"filled"}>
                    {invitedMember?.role === "admin" ? <IconUserShield size={"1.2rem"} /> : <IconUser size={"1.2rem"} />}
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Rolle bearbeiten</Menu.Label>
                  <Menu.Item icon={<IconUserShield size={14} />}>Admin</Menu.Item>
                  <Menu.Item icon={<IconUser size={14} />}>Benutzer</Menu.Item>
                </Menu.Dropdown>
              </Menu>

              <ActionIcon size={"lg"} variant={"filled"}>
                <IconTrashX size={"1.2rem"} />
              </ActionIcon>
            </Group>
          </Group>
        ))}
      </Stack>
    </Paper>
  );
}
