import { Avatar, Menu } from "@mantine/core";
import { IconLogout, IconSettings, IconTrash } from "@tabler/icons-react";

export default function UserMenu({ session, signOut }: { session: any; signOut: any }) {
  return (
    <Menu shadow="md" withArrow>
      <Menu.Target>
        <Avatar src={session?.user?.image} alt={"Profilbild"} radius={"xl"} />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Benutzer</Menu.Label>
        <Menu.Item icon={<IconSettings size={14} />} disabled>
          Einstellungen
        </Menu.Item>
        <Menu.Item icon={<IconLogout size={14} />} onClick={() => signOut()}>
          Ausloggen
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item color="red" icon={<IconTrash size={14} />} disabled>
          Benutzer löschen
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
