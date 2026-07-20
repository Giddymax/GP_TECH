"use client";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { iconMap, iconNames } from "@/lib/icon-map";

export function IconSelect({ value, onChange }: { value: string; onChange: (name: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Choose an icon" />
      </SelectTrigger>
      <SelectContent>
        {iconNames.map((name) => {
          const Icon = iconMap[name];
          return (
            <SelectItem key={name} value={name}>
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {name}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
