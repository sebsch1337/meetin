import {
  ActionIcon,
  Badge,
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
import { IconHome, IconPhone, IconSun } from "@tabler/icons-react";
import Link from "next/link";

export default function LocationDetailsBasics({
  location,
  averageVisitors,
  lastVisit,
  tags,
}: {
  location: Location;
  averageVisitors: number;
  lastVisit: string;
  tags: Tag[];
}) {
  return (
    <Container fluid px={"xl"} py={"xs"}>
      <Grid grow>
        <Grid.Col xs={1}>
          <Stack>
            <Stack spacing={0}>
              <Group position={"apart"} w={"100%"}>
                <Title order={2} size={18}>
                  Allgemein
                </Title>
                {/* <ActionIcon color="teal" size={"sm"}>
                <IconEdit size="0.9rem" />
              </ActionIcon> */}
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
                <Grid.Col span={6}>
                  <Text size={"sm"}>Telefon</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Group spacing={"xs"}>
                    <Text size={"sm"}>{location?.tel}</Text>
                    <Link href={`tel://${location?.tel}`}>
                      <ActionIcon size={"sm"} color="teal" variant="light">
                        <IconPhone size={"0.9rem"} />
                      </ActionIcon>
                    </Link>
                  </Group>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size={"sm"}>Adresse</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Stack spacing={0}>
                    <Text size={"sm"}>{`${location?.address?.road} ${location?.address?.houseNo}`}</Text>
                    <Text
                      size={"sm"}
                    >{`${location?.address?.postcode} ${location?.address?.city}-${location?.address?.suburb}`}</Text>
                  </Stack>
                </Grid.Col>
              </Grid>
            </Stack>
            <Stack spacing={0}>
              <Group position={"apart"} w={"100%"}>
                <Title order={2} size={18}>
                  Tags
                </Title>
              </Group>
              <Divider />
              <Group mb={"md"} spacing={"xs"} mih={45}>
                {tags.map(
                  (tag: any) =>
                    location.tags?.includes(tag.id) && (
                      <Badge variant={"outline"} key={tag.id} size={"xs"}>
                        {tag.name}
                      </Badge>
                    )
                )}
              </Group>
            </Stack>
          </Stack>
        </Grid.Col>
        <Grid.Col xs={1}>
          <Stack>
            <Stack spacing={0}>
              <Group position={"apart"} w={"100%"}>
                <Title order={2} size={18}>
                  Beschreibung
                </Title>
                {/* <ActionIcon color="teal" size={"sm"}>
                  <IconEdit size="0.9rem" />
                </ActionIcon> */}
              </Group>
              <Divider />
              <Text size={"sm"} mt={"xs"}>
                {location?.description || "Keine Beschreibung vorhanden."}
              </Text>
            </Stack>
            <Stack spacing={0}>
              <Group position={"apart"} w={"100%"}>
                <Title order={2} size={18}>
                  Hinweise
                </Title>
                {/* <ActionIcon color="teal" size={"sm"}>
                  <IconEdit size="0.9rem" />
                </ActionIcon> */}
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
