import React from "react";
import { useRouter } from "next/navigation";
import { IconCalendar, IconGlass, IconMessages, IconDatabase } from "@tabler/icons-react";
import { ThemeIcon, UnstyledButton, Group, Text } from "@mantine/core";

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  link: string;
  setOpened(): void;
}

interface MainLinksProps {
  setOpened(): void;
}

function MainLink({ icon, color, label, link, setOpened }: MainLinkProps) {
  const router = useRouter();

  return (
    <UnstyledButton
      onClick={() => {
        router.push(link);
        setOpened();
      }}
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        },
      })}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>

        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
}

const data = [{ icon: <IconGlass size="1rem" />, color: "teal", label: "Locations", link: "/locations/" }];

export function MainLinks({ setOpened }: MainLinksProps) {
  const links = data.map((link) => <MainLink {...link} key={link.label} setOpened={setOpened} />);
  return <div>{links}</div>;
}
