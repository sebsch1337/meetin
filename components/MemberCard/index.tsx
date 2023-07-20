import { useState } from "react";

import PaperCard from "../PaperCard";
import MemberCardItem from "../MemberCardItem";

export default function MemberCard({ team, members }: { team: Team; members: any[] }) {
  const [teamMembers, setTeamMembers] = useState(members || []);

  return (
    <PaperCard title={"Mitglieder verwalten"}>
      {teamMembers?.map((member: any) => (
        <MemberCardItem key={member.id} member={member} />
      ))}
    </PaperCard>
  );
}
