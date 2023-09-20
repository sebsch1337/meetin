import { Chip, Flex, ScrollArea, Title } from "@mantine/core";

interface LocationFilterProps {
  tags: Tag[];
  filteredTagIds?: string[];
  setFilteredTagIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export const LocationFilter: React.FC<LocationFilterProps> = ({ tags, filteredTagIds, setFilteredTagIds }) => {
  return (
    <>
      <Title order={2} size={"h6"} my={"xs"}>
        Filtern
      </Title>
      <ScrollArea type={"never"} style={{ overflow: "auto", whiteSpace: "nowrap" }}>
        <Flex gap={5} wrap={"nowrap"}>
          <Chip.Group multiple value={filteredTagIds} onChange={setFilteredTagIds}>
            {tags?.map((tag: Tag) => (
              <Chip key={tag.id} value={tag.id} color="teal">
                {tag.name}
              </Chip>
            ))}
          </Chip.Group>
        </Flex>
      </ScrollArea>
    </>
  );
};
