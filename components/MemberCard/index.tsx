import PaperCard from "../PaperCard";
import MemberCardItem from "../MemberCardItem";
import { changeUserRole, getUsersAndAdminsForTeamId, removeUserFromTeam } from "@/lib/teamLib";
import { useRouter } from "next/router";

export default function MemberCard({
  teamId,
  teamMembers,
  setTeamMembers,
  session,
}: {
  teamId: any;
  teamMembers: any[];
  setTeamMembers: any;
  session: any;
}) {
  const router = useRouter();

  const deleteItemHandler = async (userId: any) => {
    await removeUserFromTeam(userId);
    if (userId === session.user.id) router.push("/team");
    const newMembers = await getUsersAndAdminsForTeamId(teamId);
    setTeamMembers(newMembers);
  };

  const changeRoleHandler = async (userId: string, role: string) => {
    await changeUserRole(userId, role);
    if (userId === session.user.id) router.push("/team");
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
