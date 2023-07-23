import PaperCard from "../PaperCard";
import MemberCardItem from "../MemberCardItem";
import { changeUserRole, getUsersAndAdminsForTeamId, removeUserFromTeam } from "@/lib/teamLib";

export default function MemberCard({ teamId, teamMembers, setTeamMembers }: { teamId: any; teamMembers: any[]; setTeamMembers: any }) {
  const deleteItemHandler = async (userId: any) => {
    await removeUserFromTeam(userId);
    const newMembers = await getUsersAndAdminsForTeamId(teamId);
    setTeamMembers(newMembers);
  };

  const changeRoleHandler = async (userId: string, role: string) => {
    await changeUserRole(userId, role);
    const newMembers = await getUsersAndAdminsForTeamId(teamId);
    setTeamMembers(newMembers);
  };

  return (
    <PaperCard title={"Mitglieder verwalten"}>
      {teamMembers?.map((member: any) => (
        <MemberCardItem
          key={member.id}
          member={member}
          changeUserRole={changeRoleHandler}
          deleteItem={async () => await deleteItemHandler(member.id)}
        />
      ))}
    </PaperCard>
  );
}
