import { Chip, Flex, ScrollArea, Title } from "@mantine/core";

interface LocationSortProps {
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
}

export const LocationSort: React.FC<LocationSortProps> = ({ sortBy, setSortBy }) => {
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  return (
    <>
      <Title order={2} size={"h6"} my={"xs"}>
        Sortieren
      </Title>
      <ScrollArea type={"never"} style={{ overflow: "auto", whiteSpace: "nowrap" }}>
        <Flex gap={5} wrap={"nowrap"}>
          <Chip.Group value={sortBy} onChange={handleSortChange}>
            <Chip value={"aToZ"} color="teal">
              A-Z
            </Chip>
            <Chip value={"leastVisited"} color="teal">
              Lange nicht besucht
            </Chip>
            <Chip value={"recentlyVisited"} color="teal">
              Kürzlich besucht
            </Chip>
            <Chip value={"maxVisitors"} color="teal">
              Max. Besucher
            </Chip>
            <Chip value={"averageVisitors"} color="teal">
              Beliebt
            </Chip>
          </Chip.Group>
        </Flex>
      </ScrollArea>
    </>
  );
};
