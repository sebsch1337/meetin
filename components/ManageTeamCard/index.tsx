import { Button } from "@mantine/core";
import PaperCard from "../PaperCard";
import { IconDoorExit, IconPlus, IconTrash } from "@tabler/icons-react";

interface ManageTeamCardProps {
  team: Team;
  setModal: React.Dispatch<React.SetStateAction<Modal>>;
  openModal: Function;
  isAdmin: boolean;
}

export const ManageTeamCard: React.FC<ManageTeamCardProps> = ({ team, setModal, openModal, isAdmin = false }) => {
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

      <Button
        leftIcon={<IconDoorExit size="1rem" />}
        onClick={() => {
          setModal({ title: "Team verlassen", type: "leave" });
          openModal();
        }}
      >
        Team verlassen
      </Button>
    </PaperCard>
  );
};
