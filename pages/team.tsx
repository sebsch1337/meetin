import { useState } from "react";

import { Button, Container, Space, Title } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

import AddMemberForm from "@/components/AddMemberForm";
import MemberCard from "@/components/MemberCard";
import FormModal from "@/components/FormModal";

import { IconPlus } from "@tabler/icons-react";

import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { getTeamByIdFromDb, getUsersAndAdminsForTeamFromDb } from "@/services/teamService";
import InvitedMemberCard from "@/components/InvitedMemberCard";

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) return { redirect: { destination: "/login", permanent: false } };
  if (!session?.user?.teamId) return { redirect: { destination: "/", permanent: false } };

  const team = await getTeamByIdFromDb(session.user.teamId);
  const members = await getUsersAndAdminsForTeamFromDb(session.user.teamId);

  return { props: { team, members } };
}

export default function ManageTeam({ team, members }: { team: Team; members: any[] }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [modal, setModal] = useState<Modal>();

  return (
    <Container fluid px={isMobile ? "xs" : "xl"} py={"md"}>
      <FormModal title={modal?.title} opened={modalOpened} close={closeModal}>
        {modal?.type === "form" && <AddMemberForm />}
      </FormModal>

      <Button
        leftIcon={<IconPlus size="1rem" />}
        variant={"light"}
        size={"sm"}
        color={"teal"}
        onClick={() => {
          setModal({ title: "Mitglied einladen", type: "form" });
          openModal();
        }}
      >
        Neues Mitglied
      </Button>

      <Space h={"md"} />

      <Title order={2} size={22}>
        {team.name}
      </Title>

      <Space h={"md"} />

      <MemberCard team={team} members={members} />

      <Space h={"md"} />

      <InvitedMemberCard invitedMembers={team.invitedEmails} />
    </Container>
  );
}
