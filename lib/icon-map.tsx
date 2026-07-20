import {
  Globe,
  DatabaseBackup,
  Cpu,
  LifeBuoy,
  ReceiptText,
  CreditCard,
  Printer,
  Wifi,
  BatteryCharging,
  MapPin,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Globe,
  DatabaseBackup,
  Cpu,
  LifeBuoy,
  ReceiptText,
  CreditCard,
  Printer,
  Wifi,
  BatteryCharging,
  MapPin,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
};

export const iconNames = Object.keys(iconMap);

/** Resolves an admin-entered icon name to a component, falling back to a safe default. */
export function getIcon(name: string | null | undefined): LucideIcon {
  return (name && iconMap[name]) || Sparkles;
}
