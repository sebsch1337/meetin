import { Text, Image, SimpleGrid, Flex, createStyles } from "@mantine/core";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto, IconPhotoPlus } from "@tabler/icons-react";

export default function PictureDropzone({
  uploadImageHandler,
  preValues,
  setLoading,
}: {
  uploadImageHandler: any;
  preValues: any;
  setLoading: any;
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
        await uploadImageHandler(images, preValues.id);
        setLoading(false);
      }}
      onReject={(images) => {
        console.log("rejected images", images);
        console.log("maxfiles", 4 - preValues?.images?.length);
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
