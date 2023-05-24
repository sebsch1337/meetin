import { useState } from "react";
import {
  createStyles,
  Header,
  Group,
  ActionIcon,
  Container,
  Burger,
  rem,
  Text,
  Drawer,
  ScrollArea,
  Divider,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconBrandInstagram, IconBrandFacebook, IconHeartHandshake } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  inner: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    height: rem(56),

    [theme.fn.smallerThan("sm")]: {
      justifyContent: "flex-start",
    },
  },

  links: {
    width: rem(260),

    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  social: {
    width: rem(260),

    [theme.fn.smallerThan("sm")]: {
      width: "auto",
      marginLeft: "auto",
    },
  },

  burger: {
    marginRight: theme.spacing.md,

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  logoLink: {
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
  },

  mobileLink: {
    padding: `${rem(16)}`,
    fontSize: theme.fontSizes.md,
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({ variant: "light", color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
    },
  },
}));

interface HeaderMiddleProps {
  children: any;
}

export default function HeaderMiddle({ children }: HeaderMiddleProps) {
  const router = useRouter();

  const links = [
    { link: "/events", label: "Events" },
    { link: "/locations", label: "Locations" },
  ];

  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [active, setActive] = useState(links.find((link) => link.link === router.pathname)?.link);
  const { classes, cx, theme } = useStyles();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const items = links.map((link) => (
    <Link
      key={link.label}
      href={link.link}
      className={cx(classes.link, { [classes.linkActive]: active === link.link })}
      onClick={() => {
        setActive(link.link);
      }}
    >
      {link.label}
    </Link>
  ));

  return (
    <>
      <Header height={56}>
        <Container className={classes.inner}>
          <Group className={classes.links} spacing={5}>
            {items}
          </Group>

          <Link
            href="/"
            className={classes.logoLink}
            onClick={() => {
              setActive("");
            }}
          >
            <Group spacing={5}>
              <IconHeartHandshake />
              <Text size={18}>MeetIn</Text>
              {isMobile && <Text size={14}>{active?.substring(1)}</Text>}
            </Group>
          </Link>

          <Group spacing={0} className={classes.social} position="right" noWrap mr={"xl"}>
            <ActionIcon size="lg">
              <IconBrandFacebook size="1.1rem" stroke={1.5} />
            </ActionIcon>
            <ActionIcon size="lg">
              <IconBrandInstagram size="1.1rem" stroke={1.5} />
            </ActionIcon>
          </Group>
          <Burger opened={drawerOpened} onClick={toggleDrawer} size="sm" className={classes.burger} />
        </Container>
      </Header>
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Menü"
        className={classes.hiddenDesktop}
      >
        <ScrollArea h={`calc(100vh - ${rem(60)})`} m="-md">
          <Divider my="sm" color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"} />

          <Link
            href="/"
            className={cx(classes.link, classes.mobileLink)}
            onClick={() => {
              setActive("/");
              closeDrawer();
            }}
          >
            Home
          </Link>
          <Link
            href="/events"
            className={cx(classes.link, classes.mobileLink)}
            onClick={() => {
              setActive("/events");
              closeDrawer();
            }}
          >
            Events
          </Link>
          <Link
            href="/locations"
            className={cx(classes.link, classes.mobileLink)}
            onClick={() => {
              setActive("/locations");
              closeDrawer();
            }}
          >
            Locations
          </Link>

          {/* <Divider my="sm" color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"} /> */}

          {/* <Group position="center" grow pb="xl" px="md">
            <Button variant="default">Log in</Button>
            <Button>Registrieren</Button>
          </Group> */}
        </ScrollArea>
      </Drawer>
      <main>{children}</main>
    </>
  );
}
