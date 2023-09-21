import { Modal } from "@mantine/core";

interface FormModalProps {
  opened: boolean;
  close: () => void;
  title?: string;
  children: React.ReactNode;
}

export const FormModal: React.FC<FormModalProps> = ({ opened, close, title = "", children }) => {
  return (
    <Modal.Root opened={opened} onClose={close} centered>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header style={{ zIndex: 200 }} px={0} mx={"md"}>
          <Modal.Title>{title}</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};
