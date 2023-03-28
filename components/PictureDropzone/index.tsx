import { Text, Image, SimpleGrid, Flex, createStyles } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto } from "@tabler/icons-react";

export default function PictureDropzone({
  images,
  setImages,
  preValues,
}: {
  images: string[];
  setImages: any;
  preValues: any;
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

  const previews = images.map((file: any, index) => {
    const imageUrl = URL.createObjectURL(file);

    return (
      <Image
        key={index}
        src={imageUrl}
        alt={"Uploaded image"}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
        radius={"xs"}
      />
    );
  });

  const { classes } = useStyles();

  return (
    <div>
      <Dropzone
        accept={IMAGE_MIME_TYPE}
        onDrop={setImages}
        onReject={(files) => console.log("rejected files", files)}
        maxFiles={4 - preValues?.images?.length}
        maxSize={5242880}
        disabled={preValues?.images?.length > 3}
        className={preValues?.images?.length > 3 ? classes.disabled : ""}
      >
        <Flex justify={"center"} align={"center"} gap={"xs"}>
          <IconPhoto size={"2.5rem"} />
          <Flex direction={"column"}>
            <Text inline size={"md"}>
              Bilder hochladen
            </Text>
            <Text size="xs" color="dimmed" inline mt={7}>
              Max. 4 Bilder. Bildgröße max. 5 MB.
            </Text>
          </Flex>
        </Flex>
      </Dropzone>

      <SimpleGrid cols={4} breakpoints={[{ maxWidth: "xs", cols: 1 }]} mt={previews.length > 0 ? "xl" : 0}>
        {previews}
      </SimpleGrid>
    </div>
  );
}
