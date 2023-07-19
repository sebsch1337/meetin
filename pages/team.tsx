import { useState } from "react";

import { Button, Container, Space, Title } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

import AddMemberForm from "@/components/AddMemberForm";
import MemberCard from "@/components/MemberCard";
import FormModal from "@/components/FormModal";

import { IconPlus } from "@tabler/icons-react";

export default function ManageTeam() {
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

      <Title order={2}>Team {}</Title>

      <Space h={"md"} />

      <MemberCard />
    </Container>
  );
}
