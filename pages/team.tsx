import { useState } from "react";

import { Container, Grid, Space } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

import { AddMemberForm } from "@/components/MemberForm";
import { MemberCard } from "@/components/MemberCard";
import { FormModal } from "@/components/FormModal";
import { InvitedMemberCard } from "@/components/InvitedMemberCard";
import { ManageTeamCard } from "@/components/ManageTeamCard";

import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { useSession, signOut } from "next-auth/react";

import { getTeamByIdFromDb, getUsersAndAdminsForTeamFromDb } from "@/services/teamService";
import { getUserRoleInTeamFromDb } from "@/services/userService";

import { createInvitation, deleteTeam } from "@/lib/teamLib";
import { DeleteTeamModal } from "@/components/DeleteTeamModal";
import { LeaveTeamModal } from "@/components/LeaveTeamModal";

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) return { redirect: { destination: "/login", permanent: false } };
  if (!session?.user?.teamId) return { redirect: { destination: "/", permanent: false } };

  const team = await getTeamByIdFromDb(session.user.teamId);
  const members = await getUsersAndAdminsForTeamFromDb(session.user.teamId);
  const userRole = await getUserRoleInTeamFromDb(session.user.id, session.user.teamId);
  if (!team || !members || !userRole) return { redirect: { destination: "/", permanent: false } };

  return { props: { team, members, userRole } };
}

export default function ManageTeam({ team, members, userRole }: { team: Team; members: any[]; userRole: string }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [modal, setModal] = useState<Modal>({});
  const { data: session } = useSession();

  const [teamMembers, setTeamMembers] = useState(members || []);
  const [invitedEmails, setInvitedEmails] = useState<InvitedEmails[]>(team?.invitedEmails || []);

  return (
    <>
      <FormModal title={modal?.title} opened={modalOpened} close={closeModal}>
        {modal?.type === "form" && <AddMemberForm closeModal={closeModal} setInvitedEmails={setInvitedEmails} />}
        {modal?.type === "delete" && <DeleteTeamModal team={team} deleteTeam={deleteTeam} signOut={signOut} />}
        {modal?.type === "leave" && <LeaveTeamModal userId={session?.user?.id} />}
      </FormModal>
      <Container fluid px={isMobile ? "xs" : "xl"} py={"md"}>
        <Grid grow>
          <Grid.Col span={3}>
            <ManageTeamCard team={team} setModal={setModal} openModal={openModal} isAdmin={userRole === "admin"} />
          </Grid.Col>
          <Grid.Col span={9}>
            {userRole === "admin" && (
              <>
                <MemberCard session={session} teamId={team.id} teamMembers={teamMembers} setTeamMembers={setTeamMembers} />
                <Space h={"md"} />
                <InvitedMemberCard invitedMembers={invitedEmails} setInvitedEmails={setInvitedEmails} teamId={team.id} />
              </>
            )}
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}
