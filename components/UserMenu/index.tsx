import { Avatar, Menu, UnstyledButton } from "@mantine/core";
import { IconLogout, IconSettings, IconTrash, IconUsersGroup } from "@tabler/icons-react";
import { Session } from "next-auth/core/types";
import Link from "next/link";

interface UserMenuProps {
  session: Session;
  signOut: Function;
}

export const UserMenu: React.FC<UserMenuProps> = ({ session, signOut }) => {
  return (
    <Menu shadow="md" withArrow>
      <Menu.Target>
        <UnstyledButton>
          <Avatar src={session?.user?.image} alt={"Profilbild"} radius={"xl"} />
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{session?.user?.name}</Menu.Label>
        <Menu.Item component={Link} href={"/team"} icon={<IconUsersGroup size={14} />}>
          Team verwalten
        </Menu.Item>

        <Menu.Divider />

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
};
