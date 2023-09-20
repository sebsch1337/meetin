import { PaperCard } from "../PaperCard";
import { MemberCardItem } from "../MemberCardItem";
import { changeUserRole, getUsersAndAdminsForTeamId, removeUserFromTeam } from "@/lib/teamLib";
import { useRouter } from "next/router";
import { Session } from "next-auth/core/types";

interface MemberCardProps {
  teamId?: string;
  teamMembers: Team[];
  setTeamMembers: React.Dispatch<React.SetStateAction<string[]>>;
  session: Session | null;
}

export const MemberCard: React.FC<MemberCardProps> = ({ teamId, teamMembers, setTeamMembers, session }) => {
  const router = useRouter();

  const deleteItemHandler = async (userId: any) => {
    if (!userId || !teamId) return;

    await removeUserFromTeam(userId);
    if (userId === session?.user?.id) router.push("/team");

    const newMembers = await getUsersAndAdminsForTeamId(teamId);
    setTeamMembers(newMembers);
  };

  const changeRoleHandler = async (userId?: string, role?: string) => {
    if (!userId || !role || !teamId) return;

    await changeUserRole(userId, role);
    if (userId === session?.user?.id) router.push("/team");

    const newMembers = await getUsersAndAdminsForTeamId(teamId);
    setTeamMembers(newMembers);
  };

  return (
    <PaperCard title={"Mitglieder verwalten"}>
      {teamMembers?.map((member: any) => (
        <MemberCardItem
          key={member.id}
          member={member}
          changeRoleHandler={changeRoleHandler}
          deleteItem={async () => await deleteItemHandler(member.id)}
        />
      ))}
    </PaperCard>
  );
};
