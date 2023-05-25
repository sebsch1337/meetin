import { Chip, Flex, ScrollArea, Title } from "@mantine/core";

export default function LocationSort({ sortBy, setSortBy }: { sortBy: string; setSortBy: any }) {
  return (
    <>
      <Title order={2} size={"h6"} my={"xs"}>
        Sortieren
      </Title>
      <ScrollArea type={"never"} style={{ overflow: "auto", whiteSpace: "nowrap" }}>
        <Flex gap={5} wrap={"nowrap"}>
          <Chip.Group value={sortBy} onChange={setSortBy}>
            <Chip value={"leastVisited"} color="teal">
              Lange nicht besucht
            </Chip>
            <Chip value={"recentlyVisited"} color="teal">
              Kürzlich besucht
            </Chip>
            <Chip value={"maxVisitors"} color="teal">
              Max. Besucher
            </Chip>
          </Chip.Group>
        </Flex>
      </ScrollArea>
    </>
  );
}
