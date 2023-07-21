import PaperCard from "../PaperCard";
import MemberCardItem from "../MemberCardItem";
import { getUsersAndAdminsForTeamId, removeUserFromTeam } from "@/lib/teamLib";

export default function MemberCard({ teamId, teamMembers, setTeamMembers }: { teamId: any; teamMembers: any[]; setTeamMembers: any }) {
  const deleteItemHandler = async (userId: any) => {
    await removeUserFromTeam(userId);
    const newMembers = await getUsersAndAdminsForTeamId(teamId);
    console.log(newMembers);
    setTeamMembers(newMembers);
  };

  return (
    <PaperCard title={"Mitglieder verwalten"}>
      {teamMembers?.map((member: any) => (
        <MemberCardItem key={member.id} member={member} deleteItem={async () => await deleteItemHandler(member.id)} />
      ))}
    </PaperCard>
  );
}
