import PaperCard from "../PaperCard";
import MemberCardItem from "../MemberCardItem";
import { Text } from "@mantine/core";
import { declineInvitation } from "@/lib/teamLib";

export default function InvitedMemberCard({
  invitedMembers,
  setInvitedMembers,
}: {
  invitedMembers: any;
  setInvitedMembers: any;
  teamId: any;
}) {
  const deleteItemHandler = async (email: any) => {
    const newInvitedMembers = await declineInvitation(email);
    setInvitedMembers(newInvitedMembers.invitedEmails);
  };

  return (
    <PaperCard title="Eingeladene Mitglieder">
      {invitedMembers.length > 0 ? (
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
}
