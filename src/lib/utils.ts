import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const timeFormat = (value: string) => {
  if (!value) {
    return value;
  }
  const onlyNums = value.replace(/[^\d]/g, "");

  if (onlyNums.length <= 2) {
    return onlyNums;
  }

  const minutes = +onlyNums.slice(2, 4);
  const tFormat = `${onlyNums.slice(0, 2)}:${Math.min(minutes, 59)}`;

  return tFormat;
};

export const timeToMinutes = (value?: string | null) => {
  if (!value) return 0;

  const [hours, minutes] = value.split(":");
  return Number(hours || 0) * 60 + Number(minutes || 0);
};
