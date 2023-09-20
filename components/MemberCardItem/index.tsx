import { ActionIcon, Group, Menu, Text } from "@mantine/core";
import { IconTrashX, IconUser, IconUserShield } from "@tabler/icons-react";
import { useRouter } from "next/router";

interface MemberCardItemProps {
  member: Member;
  deleteItem: () => void;
  invited?: boolean;
  changeRoleHandler?: (userId?: string, role?: string) => Promise<void>;
}

export const MemberCardItem: React.FC<MemberCardItemProps> = ({ member, deleteItem, invited = false, changeRoleHandler }) => {
  const router = useRouter();

  return (
    <Group key={member.email} position="apart" noWrap>
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
              <Menu.Item icon={<IconUserShield size={14} />} onClick={() => changeRoleHandler && changeRoleHandler(member.id, "admin")}>
                Admin
              </Menu.Item>
              <Menu.Item icon={<IconUser size={14} />} onClick={() => changeRoleHandler && changeRoleHandler(member.id, "user")}>
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
};
