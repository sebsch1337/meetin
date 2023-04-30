import PictureBox from "@/components/PictureBox";
import PictureDropzone from "@/components/PictureDropzone";
import { deleteImage } from "@/lib/imageLib";
import { Carousel } from "@mantine/carousel";
import { ActionIcon, Flex, getStylesRef, rem, Image } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconDownload } from "@tabler/icons-react";
import Link from "next/link";

export function LocationDetailsPictures({
  location,
  setLoading,
  setLocation,
  isMobile,
}: {
  location: Location;
  setLoading: any;
  setLocation: any;
  isMobile: boolean;
}) {
  return (
    <Flex justify={"center"} align={"center"} direction={"column"} gap={"xs"}>
      <Carousel
        withIndicators
        speed={25}
        w={isMobile ? "100vw" : 800}
        slideSize={isMobile ? "100vw" : 800}
        height={isMobile ? 200 : 400}
        styles={{
          control: {
            "&[data-inactive]": {
              opacity: 0,
              cursor: "default",
            },
          },
          indicator: {
            width: rem(12),
            height: rem(4),
            transition: "width 250ms ease",

            "&[data-active]": {
              width: rem(40),
            },
          },
          controls: {
            ref: getStylesRef("controls"),
            transition: "opacity 150ms ease",
            opacity: 0,
          },

          root: {
            "&:hover": {
              [`& .${getStylesRef("controls")}`]: {
                opacity: 1,
              },
            },
          },
        }}
      >
        {location?.images?.length > 0 &&
          location?.images?.map((image) => (
            <Carousel.Slide key={image.publicId}>
              <Link href={image.url} target="_blank">
                <ActionIcon
                  variant="light"
                  style={{ position: "absolute", top: "1rem", right: "2rem", zIndex: 2 }}
                >
                  <IconDownload />
                </ActionIcon>
              </Link>
              <Image
                src={image.url}
                height={isMobile ? 200 : 400}
                alt={`Bild von ${location.name}`}
                style={{ objectFit: "cover", objectPosition: "center" }}
                placeholder={"empty"}
              />
            </Carousel.Slide>
          ))}
        <Carousel.Slide>
          <Flex justify={"center"} align={"center"} gap={"xs"} h={"100%"}>
            <PictureDropzone preValues={location} setLoading={setLoading} setLocation={setLocation} />
          </Flex>
        </Carousel.Slide>
      </Carousel>
      <PictureBox location={location} deleteImage={deleteImage} setLocation={setLocation} />
    </Flex>
  );
}
