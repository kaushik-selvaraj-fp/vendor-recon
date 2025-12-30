//types/StatsCardType.ts
interface IconComponentProps {
  className?: string;
}
type IconType = React.ComponentType<IconComponentProps>;

export interface StatsCardProps {
  title: string;
  /** value can be a formatted string or a raw number (number will be formatted as currency) */
  value: string | number;
  /** optional currency code used when value is a number (defaults to USD) */
  currency?: string;
  change: number;
  icon: IconType;
  color?: "primary" | "secondary" | "success" | "danger" | "warning";
} 