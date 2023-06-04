import { Button, LoadingOverlay, Space, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";

export default function DeleteModal({
  type,
  deleteData,
  closeModal,
}: {
  type: string;
  deleteData: any;
  closeModal: any;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <>
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <Text size={"sm"}>{`${
        type === "event"
          ? "Möchtest du dieses Event wirklich löschen?"
          : "Möchtest du diese Location wirklich löschen?"
      }`}</Text>
      <Space mt={"xl"} />
      <Button
        variant={"light"}
        size={"sm"}
        color={"red"}
        fullWidth
        onClick={async () => {
          setLoading(true);
          await deleteData();
          router.push(type === "event" ? "/events" : "/locations");
        }}
      >
        Löschen
      </Button>
    </>
  );
}
