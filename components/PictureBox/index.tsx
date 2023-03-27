import { createStyles, Flex, Paper, UnstyledButton, getStylesRef } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import Image from "next/image";

const useStyles = createStyles((theme) => ({
  imageButton: {
    position: "relative",
    "&:hover::before": {
      content: '""',
      display: "block",
      position: "absolute",
      top: 0,
      left: 0,
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
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

export default function PictureBox({ images }: { images: string[] }) {
  const { classes } = useStyles();

  return (
    <Paper withBorder={true} p={10}>
      <Flex gap={"xs"} align={"center"} justify={"space-between"} wrap={"wrap"}>
        {images?.map((imageUrl) => (
          <UnstyledButton key={imageUrl} className={classes.imageButton}>
            <Image
              src={imageUrl}
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
  );
}
