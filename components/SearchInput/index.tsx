import { Input } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

interface SearchInputProps {
  searchString: string;
  setSearchString: React.Dispatch<React.SetStateAction<string>>;
}

export const SearchInput: React.FC<SearchInputProps> = ({ searchString, setSearchString }) => {
  return (
    <Input
      icon={<IconSearch size="1rem" />}
      placeholder="Suchen..."
      value={searchString}
      onChange={(event) => setSearchString(event.target.value)}
    />
  );
};
