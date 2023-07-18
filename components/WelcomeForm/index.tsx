import { getTeamByName } from "@/lib/teamLib";
import { Space, Text, TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useEffect, useState } from "react";

export default function WelcomeForm({ setButtonDisabled, setTeamName }: { setButtonDisabled: any; setTeamName: any }) {
  const [searchString, setSearchString] = useState("");
  const [inputError, setInputError]: any = useState(false);
  const [debouncedSearchString] = useDebouncedValue(searchString, 200);

  useEffect(() => {
    const fetchTeamName = async (searchString: string) => {
      try {
        if (searchString.length > 0) {
          const foundTeamName = await getTeamByName(searchString);

          if (foundTeamName?.name?.length > 0) {
            setInputError("Name bereits vergeben.");
            setButtonDisabled(true);
          } else {
            setTeamName(searchString);
            setInputError(false);
            setButtonDisabled(false);
          }
        } else {
          setInputError(false);
          setButtonDisabled(true);
        }
      } catch (e) {
        console.error(e);
        return e;
      }
    };

    fetchTeamName(debouncedSearchString);
  }, [debouncedSearchString, setButtonDisabled, setTeamName]);

  return (
    <>
      <Text>
        Lasst uns zunächst ein Team bilden. Du kannst später noch weitere Teammitglieder hinzufügen.
        <Space />
        Alle Mitglieder erhalten Zugriff auf die im Team hinterlegten Locations und Events.
      </Text>
      <Space h={"sm"} />

      <TextInput
        label="Teamname"
        description="Gib deinem Team einen Namen."
        placeholder="z.B. Neu in Dortmund"
        error={inputError}
        onChange={(event) => setSearchString(event.target.value)}
        maxLength={50}
      />
    </>
  );
}
