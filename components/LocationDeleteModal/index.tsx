import { Button, LoadingOverlay, Space, Text } from "@mantine/core";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";

export const LocationDeleteModal = ({
  deleteLocation,
  closeModal,
}: {
  deleteLocation: any;
  closeModal: any;
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <>
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <Text size={"sm"}>Möchtest du diese Location wirklich löschen?</Text>
      <Space mt={"xl"} />
      <Button
        variant={"light"}
        size={"sm"}
        color={"red"}
        fullWidth
        onClick={async () => {
          setLoading(true);
          await deleteLocation();
          setLoading(false);
          closeModal();
          router.push("/locations");
        }}
      >
        Löschen
      </Button>
    </>
  );
};
