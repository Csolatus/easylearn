import { ChipRoot, ChipLabel } from "@heroui/react";

const STATUS_COLORS: Record<string, "default" | "accent" | "success" | "warning" | "danger"> = {
  active:    "success",
  invited:   "warning",
  suspended: "danger",
  removed:   "default",
};

const STATUS_LABELS: Record<string, string> = {
  active:    "Actif",
  invited:   "Invité",
  suspended: "Suspendu",
  removed:   "Retiré",
};

type Props = {
  status: string;
  label?: string;
};

export default function StatusBadge({ status, label }: Props) {
  const color = STATUS_COLORS[status] ?? "default";
  const text = label ?? STATUS_LABELS[status] ?? status;
  return (
    <ChipRoot color={color} size="sm">
      <ChipLabel>{text}</ChipLabel>
    </ChipRoot>
  );
}
