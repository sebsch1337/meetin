import { Modal } from "@mantine/core";

interface DetailsModalProps {
  opened: boolean;
  onClose: () => void;
  modal: Modal;
  children: React.ReactNode;
}

export const DetailsModal: React.FC<DetailsModalProps> = ({ opened, onClose, modal, children }) => {
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
};
