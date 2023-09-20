import { PaperCard } from "../PaperCard";
import { MemberCardItem } from "../MemberCardItem";
import { Text } from "@mantine/core";
import { declineInvitation } from "@/lib/teamLib";

interface InvitedMemberCardProps {
  invitedMembers?: InvitedEmails[] | null;
  setInvitedEmails: React.Dispatch<React.SetStateAction<InvitedEmails[]>>;
  teamId: Team["id"];
}

export const InvitedMemberCard: React.FC<InvitedMemberCardProps> = ({ invitedMembers, setInvitedEmails }) => {
  const deleteItemHandler = async (email: any) => {
    const newInvitedMembers = await declineInvitation(email);
    setInvitedEmails(newInvitedMembers);
  };

  return (
    <PaperCard title="Eingeladene Mitglieder">
      {invitedMembers && invitedMembers.length > 0 ? (
        invitedMembers?.map((member: any) => (
          <MemberCardItem
            key={member.email}
            member={member}
            invited={true}
            deleteItem={async () => await deleteItemHandler(member.email)}
          />
        ))
      ) : (
        <Text size={"sm"} fs={"italic"} c={"dimmed"}>
          Keine Einladungen vorhanden
        </Text>
      )}
    </PaperCard>
  );
};
