import {
  createStyles,
  Flex,
  Paper,
  UnstyledButton,
  getStylesRef,
  Modal,
  Text,
  Button,
  LoadingOverlay,
  Group,
  Space,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  imageButton: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover::before": {
      content: '""',
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    [`&:hover .${getStylesRef("icon")}`]: {
      display: "block",
    },
  },
  trashIcon: {
    ref: getStylesRef("icon"),
    display: "none",
    position: "absolute",
  },
}));

export default function PictureBox({
  deleteImage,
  location,
  setLocation,
}: {
  deleteImage: any;
  location: any;
  setLocation: any;
}) {
  const { classes } = useStyles();
  const [deleteImageId, setDeleteImageId] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Bild löschen" centered>
        <Text size={"sm"}>Bild unwiderruflich löschen?</Text>
        <Space h={"md"} />
        <Group position="right">
          <Button
            variant={"light"}
            size={"sm"}
            color={"red"}
            onClick={async () => {
              close();
              setVisible(true);
              await deleteImage(deleteImageId, location.id, setLocation);
              setVisible(false);
            }}
          >
            Löschen
          </Button>
        </Group>
      </Modal>

      {location?.images?.length > 0 && (
        <Paper withBorder={true} p={10} maw={500}>
          <LoadingOverlay visible={visible} overlayBlur={2} />
          <Flex gap={"xs"} align={"center"} wrap={"wrap"}>
            {location?.images?.map((image: any) => (
              <UnstyledButton
                key={image.publicId}
                className={classes.imageButton}
                onClick={() => {
                  setDeleteImageId(image.publicId);
                  open();
                }}
              >
                <Image
                  src={image.url}
                  width={80}
                  height={80}
                  alt={"Picture"}
                  style={{ objectFit: "cover" }}
                  placeholder={"empty"}
                />
                <IconTrash size={30} className={classes.trashIcon} />
              </UnstyledButton>
            ))}
          </Flex>
        </Paper>
      )}
    </>
  );
}
