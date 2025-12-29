//types/StatsCardType.ts
interface IconComponentProps {
  className?: string;
}
type IconType = React.ComponentType<IconComponentProps>;

export interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  icon: IconType;
  color?: "primary" | "secondary" | "success" | "danger" | "warning";
}