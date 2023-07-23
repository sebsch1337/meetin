import { ActionIcon, Group, Menu, Text } from "@mantine/core";
import { IconTrashX, IconUser, IconUserShield } from "@tabler/icons-react";

export default function MemberCardItem({
  member,
  deleteItem,
  invited = false,
  changeUserRole,
}: {
  member: any;
  deleteItem: any;
  invited?: boolean;
  changeUserRole?: any;
}) {
  return (
    <Group key={member.id} position="apart" noWrap>
      <Text size={"sm"} truncate>
        {member?.email}
      </Text>
      <Group noWrap>
        {!invited ? (
          <Menu>
            <Menu.Target>
              <ActionIcon size={"lg"} variant={"filled"}>
                {member?.role === "admin" ? <IconUserShield size={"1.2rem"} /> : <IconUser size={"1.2rem"} />}
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Rolle bearbeiten</Menu.Label>
              <Menu.Item icon={<IconUserShield size={14} />} onClick={async () => await changeUserRole(member.id, "admin")}>
                Admin
              </Menu.Item>
              <Menu.Item icon={<IconUser size={14} />} onClick={async () => await changeUserRole(member.id, "user")}>
                Benutzer
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : member?.role === "admin" ? (
          <IconUserShield size={"1.2rem"} />
        ) : (
          <IconUser size={"1.2rem"} />
        )}

        <ActionIcon size={"lg"} variant={"filled"} onClick={deleteItem}>
          <IconTrashX size={"1.2rem"} />
        </ActionIcon>
      </Group>
    </Group>
  );
}
