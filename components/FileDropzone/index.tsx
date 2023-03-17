import { useState } from "react";
import { Text, Image, SimpleGrid, Flex } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";
import { IconPhoto } from "@tabler/icons-react";

export default function FileDropzone({ images, setImages }: { images: string[]; setImages: any }) {
  const previews = images.map((file: any, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        key={index}
        src={imageUrl}
        alt={"Uploaded image"}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
      />
    );
  });

  return (
    <div>
      <Dropzone accept={IMAGE_MIME_TYPE} onDrop={setImages}>
        <Flex justify={"center"} align={"center"} gap={"xs"}>
          <IconPhoto size={"2rem"} />
          <Text inline size={"md"}>
            Bilder hochladen
          </Text>
        </Flex>
      </Dropzone>

      <SimpleGrid cols={4} breakpoints={[{ maxWidth: "sm", cols: 1 }]} mt={previews.length > 0 ? "xl" : 0}>
        {previews}
      </SimpleGrid>
    </div>
  );
}
