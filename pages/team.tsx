import { useState } from "react";

import { Button, Container, Grid, Space } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

import AddMemberForm from "@/components/AddMemberForm";
import MemberCard from "@/components/MemberCard";
import FormModal from "@/components/FormModal";
import InvitedMemberCard from "@/components/InvitedMemberCard";

import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

import { getTeamByIdFromDb, getUsersAndAdminsForTeamFromDb } from "@/services/teamService";
import { getUserRoleInTeamFromDb } from "@/services/userService";

import { createInvitation } from "@/lib/teamLib";
import ManageTeamCard from "@/components/ManageTeamCard";
import { useSession } from "next-auth/react";

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) return { redirect: { destination: "/login", permanent: false } };
  if (!session?.user?.teamId) return { redirect: { destination: "/", permanent: false } };

  const team = await getTeamByIdFromDb(session.user.teamId);
  const members = await getUsersAndAdminsForTeamFromDb(session.user.teamId);
  const userRole = await getUserRoleInTeamFromDb(session.user.id, session.user.teamId);

  return { props: { team, members, userRole } };
}

export default function ManageTeam({ team, members, userRole }: { team: Team; members: any[]; userRole: string }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [modal, setModal] = useState<Modal>();
  const { data: session } = useSession();

  const [teamMembers, setTeamMembers] = useState(members || []);
  const [invitedEmails, setInvitedEmails] = useState(team.invitedEmails);

  return (
    <Container fluid px={isMobile ? "xs" : "xl"} py={"md"}>
      <FormModal title={modal?.title} opened={modalOpened} close={closeModal}>
        {modal?.type === "form" && (
          <AddMemberForm createInvitation={createInvitation} closeModal={closeModal} setInvitedEmails={setInvitedEmails} />
        )}
      </FormModal>

      <Grid grow>
        <Grid.Col span={3}>
          <ManageTeamCard team={team} setModal={setModal} openModal={openModal} isAdmin={userRole === "admin"} />
        </Grid.Col>
        <Grid.Col span={9}>
          {userRole === "admin" && (
            <>
              <MemberCard session={session} teamId={team.id} teamMembers={teamMembers} setTeamMembers={setTeamMembers} />
              <Space h={"md"} />
              <InvitedMemberCard invitedMembers={invitedEmails} setInvitedMembers={setInvitedEmails} teamId={team.id} />
            </>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
}
