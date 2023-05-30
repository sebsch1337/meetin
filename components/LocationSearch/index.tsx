import { Input } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

export default function LocationSearch({
  searchLocation,
  setSearchLocation,
}: {
  searchLocation: string;
  setSearchLocation: any;
}) {
  return (
    <Input
      icon={<IconSearch size="1rem" />}
      placeholder="Suchen..."
      value={searchLocation}
      onChange={(event) => setSearchLocation(event.target.value)}
    />
  );
}
