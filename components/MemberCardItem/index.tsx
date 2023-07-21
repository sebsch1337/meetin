import { ActionIcon, Group, Menu, Text } from "@mantine/core";
import { IconTrashX, IconUser, IconUserShield } from "@tabler/icons-react";

export default function MemberCardItem({ member, deleteItem }: { member: any; deleteItem: any }) {
  return (
    <Group key={member.id} position="apart" noWrap>
      <Text size={"sm"} truncate>
        {member?.email}
      </Text>
      <Group noWrap>
        <Menu>
          <Menu.Target>
            <ActionIcon size={"lg"} variant={"filled"}>
              {member?.role === "admin" ? <IconUserShield size={"1.2rem"} /> : <IconUser size={"1.2rem"} />}
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Rolle bearbeiten</Menu.Label>
            <Menu.Item icon={<IconUserShield size={14} />}>Admin</Menu.Item>
            <Menu.Item icon={<IconUser size={14} />}>Benutzer</Menu.Item>
          </Menu.Dropdown>
        </Menu>

        <ActionIcon size={"lg"} variant={"filled"} onClick={() => deleteItem(member?.email)}>
          <IconTrashX size={"1.2rem"} />
        </ActionIcon>
      </Group>
    </Group>
  );
}
