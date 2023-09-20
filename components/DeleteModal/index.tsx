import { Button, LoadingOverlay, Space, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";

interface DeleteModalProps {
  type: string;
  deleteData: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({ type, deleteData }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <>
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <Text size={"sm"}>{`${
        type === "event" ? "Möchtest du dieses Event wirklich löschen?" : "Möchtest du diese Location wirklich löschen?"
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
};
