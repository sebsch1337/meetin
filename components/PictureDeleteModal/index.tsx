import { Button, LoadingOverlay, Space, Text } from "@mantine/core";
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
      <Space mt={"xl"} />
      <Button
        variant={"light"}
        size={"sm"}
        color={"red"}
        fullWidth
        onClick={async () => {
          setLoading(true);
          await deleteImage();
          setLoading(false);
          closeModal();
        }}
      >
        Löschen
      </Button>
    </>
  );
}
