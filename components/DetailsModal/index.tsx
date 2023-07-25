import { Modal } from "@mantine/core";

export default function DetailsModal({ opened, onClose, modal, children }: { opened: boolean; onClose: any; modal: Modal; children: any }) {
  return (
    <Modal.Root opened={opened} onClose={onClose} centered>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header style={{ zIndex: 200 }} px={0} mx={"md"}>
          <Modal.Title>{modal.title}</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
