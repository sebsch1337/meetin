import { Modal } from "@mantine/core";

export default function FormModal({
  opened,
  close,
  title = "",
  children,
}: {
  opened: boolean;
  close: any;
  title: string | undefined;
  children: any;
}) {
  return (
    <Modal.Root opened={opened} onClose={close}>
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
}
