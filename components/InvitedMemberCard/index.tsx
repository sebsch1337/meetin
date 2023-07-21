import PaperCard from "../PaperCard";
import MemberCardItem from "../MemberCardItem";
import { Text } from "@mantine/core";
import { declineInvitation, getTeamById } from "@/lib/teamLib";

export default function InvitedMemberCard({
  invitedMembers,
  setInvitedMembers,
  teamId,
}: {
  invitedMembers: any;
  setInvitedMembers: any;
  teamId: any;
}) {
  const deleteItemHandler = async (email: any, teamId: any) => {
    await declineInvitation(email);
    const newInvitedMembers = await getTeamById(teamId);
    setInvitedMembers(newInvitedMembers);
  };

  return (
    <PaperCard title="Eingeladene Mitglieder">
      {invitedMembers.length > 0 ? (
        invitedMembers?.map((member: any) => (
          <MemberCardItem key={member.email} member={member} deleteItem={async () => await deleteItemHandler(member.email, teamId)} />
        ))
      ) : (
        <Text size={"sm"} fs={"italic"} c={"dimmed"}>
          Keine Einladungen vorhanden
        </Text>
      )}
    </PaperCard>
  );
}
