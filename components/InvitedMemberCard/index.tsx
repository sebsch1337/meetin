import PaperCard from "../PaperCard";
import MemberCardItem from "../MemberCardItem";
import { Text } from "@mantine/core";

export default function InvitedMemberCard({ invitedMembers }: { invitedMembers: any }) {
  return (
    <PaperCard title="Eingeladene Mitglieder">
      {invitedMembers.length > 0 ? (
        invitedMembers?.map((member: any) => <MemberCardItem key={member.email} member={member} />)
      ) : (
        <Text size={"sm"} fs={"italic"} c={"dimmed"}>
          Keine Einladungen vorhanden
        </Text>
      )}
    </PaperCard>
  );
}
