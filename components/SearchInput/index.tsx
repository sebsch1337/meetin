import { Input } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

export default function SearchInput({
  searchString,
  setSearchString,
}: {
  searchString: string;
  setSearchString: any;
}) {
  return (
    <Input
      icon={<IconSearch size="1rem" />}
      placeholder="Suchen..."
      value={searchString}
      onChange={(event) => setSearchString(event.target.value)}
    />
  );
}
