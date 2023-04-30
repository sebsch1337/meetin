import { uploadImages } from "@/lib/imageLib";
import { Text, Flex, createStyles } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhotoPlus, IconX } from "@tabler/icons-react";

import { notifications } from "@mantine/notifications";

export default function PictureDropzone({
  preValues,
  setLoading,
  setLocation,
}: {
  preValues: any;
  setLoading: any;
  setLocation: any;
}) {
  const useStyles = createStyles((theme) => ({
    disabled: {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
      borderColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2],
      cursor: "not-allowed",

      "& *": {
        color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[5],
      },
    },
  }));

  const { classes } = useStyles();

  return (
    <Dropzone
      accept={IMAGE_MIME_TYPE}
      onDrop={async (images) => {
        setLoading(true);
        await uploadImages(images, preValues, setLocation);
        setLoading(false);
      }}
      onReject={() => {
        notifications.show({
          icon: <IconX />,
          color: "red",
          title: "Bilderupload abgebrochen",
          message: `Bitte überprüfe Dateigröße und Anzahl der Dateien.`,
        });
      }}
      maxFiles={4 - preValues?.images?.length}
      maxSize={5242880}
      disabled={preValues?.images?.length > 3}
      className={preValues?.images?.length > 3 ? classes.disabled : ""}
    >
      <Flex justify={"center"} align={"center"} gap={"xs"}>
        <IconPhotoPlus size={"2.5rem"} />
        <Flex direction={"column"}>
          <Text inline size={"md"}>
            Bilder hochladen
          </Text>
          <Text size="xs" color="dimmed" inline mt={7}>
            Max. 4 Bilder bis 5 MB.
          </Text>
        </Flex>
      </Flex>
    </Dropzone>
  );
}
