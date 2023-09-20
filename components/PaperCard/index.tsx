import { Paper, Stack, Title, createStyles } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

interface PaperCardProps {
  title: string;
  children: React.ReactNode;
}

export const PaperCard: React.FC<PaperCardProps> = ({ title, children, ...props }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const useStyles = createStyles((theme) => ({
    paper: {
      color: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  }));
  const { theme } = useStyles();

  return (
    <Paper miw={isMobile ? "100%" : "45%"} p={"md"} radius={"lg"} bg={theme.colorScheme === "dark" ? "dark.6" : "gray.0"} {...props}>
      <Stack spacing={"xs"}>
        <Title order={3} size={14}>
          {title}
        </Title>
        {children}
      </Stack>
    </Paper>
  );
};
