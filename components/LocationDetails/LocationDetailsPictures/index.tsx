import { PictureBox } from "@/components/PictureBox";
import { PictureDropzone } from "@/components/PictureDropzone";

import { ActionIcon, Flex, getStylesRef, rem, Image } from "@mantine/core";
import { Carousel } from "@mantine/carousel";

import { IconDownload } from "@tabler/icons-react";

import Link from "next/link";

interface LocationDetailsPicturesProps {
  location: Location;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
  isMobile: boolean;
}

export const LocationDetailsPictures: React.FC<LocationDetailsPicturesProps> = ({ location, setLoading, setLocation, isMobile }) => {
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
              <ActionIcon
                component={Link}
                href={image.url}
                target={"_blank"}
                variant={"light"}
                style={{ position: "absolute", top: "1rem", right: "2rem", zIndex: 2 }}
              >
                <IconDownload />
              </ActionIcon>
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
      <PictureBox location={location} setLocation={setLocation} />
    </Flex>
  );
};
