import { Tooltip } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

export default function NoGoIcon() {
  return (
    <Tooltip color={"red"} label={"Achtung: Wurde als No-Go markiert! Siehe Hinweise..."} withinPortal>
      <IconAlertCircle size={16} color="red" />
    </Tooltip>
  );
}
