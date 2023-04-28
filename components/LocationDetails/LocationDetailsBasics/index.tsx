import {
  ActionIcon,
  Center,
  Container,
  Divider,
  Grid,
  Group,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconEdit, IconHome, IconSun } from "@tabler/icons-react";

export default function LocationDetailsBasics({
  location,
  averageVisitors,
  lastVisit,
}: {
  location: Location;
  averageVisitors: number;
  lastVisit: string;
}) {
  return (
    <Container fluid px={"xl"} py={"xs"}>
      <Grid grow>
        <Grid.Col xs={1}>
          <Stack spacing={0}>
            <Group position={"apart"} w={"100%"}>
              <Title order={2} size={18}>
                Allgemein
              </Title>
              <ActionIcon color="teal" size={"sm"}>
                <IconEdit size="0.9rem" />
              </ActionIcon>
            </Group>
            <Divider />
            <Grid grow mt={"xs"}>
              <Grid.Col span={6}>
                <Text size={"sm"}>Max. Besucherzahl</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size={"sm"}>{location?.maxCapacity}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size={"sm"}>Besucherdurchschnitt</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size={"sm"}>{averageVisitors}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size={"sm"}>Letzter Besuch</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size={"sm"}>{lastVisit}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size={"sm"}>Lokalität</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Center inline>
                  <IconHome color={location?.indoor ? "teal" : "grey"} size={18} />
                  <Space w="xs" />
                  {"|"}
                  <Space w="xs" />
                  <IconSun color={location?.outdoor ? "yellow" : "grey"} size={18} />
                </Center>
              </Grid.Col>
            </Grid>
          </Stack>
        </Grid.Col>
        <Grid.Col xs={1}>
          <Stack>
            <Stack spacing={0}>
              <Group position={"apart"} w={"100%"}>
                <Title order={2} size={18}>
                  Beschreibung
                </Title>
                <ActionIcon color="teal" size={"sm"}>
                  <IconEdit size="0.9rem" />
                </ActionIcon>
              </Group>
              <Divider />
              <Text size={"sm"} mt={"xs"}>
                {location?.description || "Keine Beschreibung vorhanden."}
              </Text>
            </Stack>
            <Stack spacing={0}>
              <Group position={"apart"} w={"100%"}>
                <Title order={2} size={18}>
                  Informationen
                </Title>
                <ActionIcon color="teal" size={"sm"}>
                  <IconEdit size="0.9rem" />
                </ActionIcon>
              </Group>
              <Divider />
              <Text size={"sm"} mt={"xs"}>
                {location?.infos || "Keine Informationen vorhanden."}
              </Text>
            </Stack>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
