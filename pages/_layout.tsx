import { useState } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Text,
  Center,
  MediaQuery,
  Burger,
  useMantineTheme,
  rem,
  Container,
} from "@mantine/core";
import { MainLinks } from "../components/MainLinks";
import { IconAtom } from "@tabler/icons-react";
import Link from "next/link";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 200 }}>
          <Navbar.Section grow mt="md">
            <MainLinks setOpened={() => setOpened(false)} />
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <Link href={"/"} style={{ textDecoration: "none", color: "inherit" }}>
              <Center>
                <IconAtom size={rem(48)} />
                <Text size={"lg"}>MeetIn</Text>
              </Center>
            </Link>
          </div>
        </Header>
      }
    >
      <Container fluid p={"xs"}>
        {children}
      </Container>
    </AppShell>
  );
}
