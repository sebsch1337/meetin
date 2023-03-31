import { Button, Group, LoadingOverlay, Text } from "@mantine/core";
import { useState } from "react";

export default function PictureDeleteModal({
  deleteImage,
  closeModal,
}: {
  deleteImage: any;
  closeModal: any;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <Text size={"sm"}>Möchtest du dieses Bild löschen?</Text>
      <Group position="right">
        <Button
          variant={"light"}
          size={"sm"}
          color={"red"}
          onClick={async () => {
            setLoading(true);
            await deleteImage();
            setLoading(false);
            closeModal();
          }}
        >
          Löschen
        </Button>
      </Group>
    </>
  );
}
