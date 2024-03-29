import { ActionIcon, Badge, Center, Container, Divider, Grid, Group, Space, Stack, Text, Title } from "@mantine/core";
import { IconHome, IconPhone, IconSun } from "@tabler/icons-react";
import Link from "next/link";

interface LocationDetailsBasicsProps {
  location: Location;
  averageVisitors: number;
  lastVisit: string;
  tags: Tag[];
}

export const LocationDetailsBasics: React.FC<LocationDetailsBasicsProps> = ({ location, averageVisitors, lastVisit, tags }) => {
  return (
    <Container fluid px={"xl"} py={"xs"}>
      <Grid grow>
        <Grid.Col xs={1}>
          <Stack>
            <Stack spacing={0}>
              <Title order={2} size={18}>
                Allgemein
              </Title>
              <Divider />
              <Grid grow mt={"xs"} gutter={"sm"}>
                <Grid.Col span={6}>
                  <Text size={"sm"}>Max. Besucherzahl</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size={"sm"}>{location?.maxCapacity ?? "-"}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size={"sm"}>Besucherdurchschnitt</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size={"sm"}>{averageVisitors ?? "-"}</Text>
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
                    <Text size={"sm"}>{location?.tel || "-"}</Text>
                    {location?.tel && (
                      <ActionIcon component={Link} href={`tel://${location?.tel}`} size={"sm"} color="teal" variant="light">
                        <IconPhone size={"0.9rem"} />
                      </ActionIcon>
                    )}
                  </Group>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size={"sm"}>Adresse</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Stack spacing={0}>
                    <Text size={"sm"}>{`${location?.address?.road} ${location?.address?.houseNo}`}</Text>
                    <Text size={"sm"}>{`${location?.address?.postcode} ${location?.address?.city}-${location?.address?.suburb}`}</Text>
                  </Stack>
                </Grid.Col>
              </Grid>
            </Stack>

            <Stack spacing={0}>
              <Title order={2} size={18}>
                Tags
              </Title>
              <Divider />
              <Group spacing={"xs"} mt={"xs"}>
                {location?.tags?.length ? (
                  location?.tags?.map((tagId) => (
                    <Badge variant={"outline"} color={"teal"} key={tagId} size={"xs"}>
                      {tags.find((tag: any) => tag.id === tagId)?.name}
                    </Badge>
                  ))
                ) : (
                  <Text size={"sm"} mt={"xs"} fs={!location?.tags ? "italic" : ""} c={!location?.tags ? "dimmed" : ""}>
                    {location?.tags || "Keine Tags vorhanden."}
                  </Text>
                )}
              </Group>
            </Stack>
          </Stack>
        </Grid.Col>

        <Grid.Col xs={1}>
          <Stack>
            <Stack spacing={0}>
              <Title order={2} size={18}>
                Beschreibung
              </Title>
              <Divider />
              <Text
                size={"sm"}
                mt={"xs"}
                fs={!location?.description ? "italic" : ""}
                c={!location?.description ? "dimmed" : ""}
                style={{ whiteSpace: "pre-line" }}
              >
                {location?.description || "Keine Beschreibung vorhanden."}
              </Text>
            </Stack>

            <Stack spacing={0}>
              <Title order={2} size={18}>
                Hinweise
              </Title>
              <Divider />
              <Text
                size={"sm"}
                mt={"xs"}
                fs={!location?.infos ? "italic" : ""}
                c={!location?.infos ? "dimmed" : ""}
                style={{ whiteSpace: "pre-line" }}
              >
                {location?.infos || "Keine Informationen vorhanden."}
              </Text>
            </Stack>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
};
