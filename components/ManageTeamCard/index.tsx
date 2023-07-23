import { Button } from "@mantine/core";
import PaperCard from "../PaperCard";
import { IconPlus, IconTrash } from "@tabler/icons-react";

export default function ManageTeamCard({
  team,
  setModal,
  openModal,
  isAdmin = false,
}: {
  team: Team;
  setModal: any;
  openModal: any;
  isAdmin: boolean;
}) {
  return (
    <PaperCard title={`Team '${team.name}' verwalten`}>
      {isAdmin && (
        <>
          <Button
            leftIcon={<IconPlus size="1rem" />}
            variant={"light"}
            size={"sm"}
            color={"teal"}
            onClick={() => {
              setModal({ title: "Mitglied einladen", type: "form" });
              openModal();
            }}
          >
            Mitglied einladen
          </Button>
          <Button
            leftIcon={<IconTrash size="1rem" />}
            variant={"light"}
            size={"sm"}
            color={"red"}
            onClick={() => {
              setModal({ title: "Team löschen", type: "delete" });
              openModal();
            }}
          >
            Team löschen
          </Button>
        </>
      )}

      <Button>Team verlassen</Button>
    </PaperCard>
  );
}
