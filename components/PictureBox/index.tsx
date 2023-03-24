import { Carousel } from "@mantine/carousel";
import { Center, Flex, Group, Paper, rem } from "@mantine/core";
import Image from "next/image";

export default function PictureBox({ images }: { images: string[] }) {
  return (
    <Paper withBorder={true} p={10}>
      <Flex gap={"xs"} align={"center"} justify={"space-between"} wrap={"wrap"}>
        {images?.map((imageUrl) => (
          <Image
            key={imageUrl}
            src={imageUrl}
            width={80}
            height={80}
            alt={"Picture"}
            style={{ objectFit: "cover" }}
            placeholder={"empty"}
          />
        ))}
      </Flex>
    </Paper>
  );
}
