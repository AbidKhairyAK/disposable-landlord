import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function merge_class(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function objectToFormData(obj: Record<string, any>) {
  const formData = new FormData();

  for (const key in obj) {
    if (obj[key] !== undefined && obj[key] !== null)
      formData.append(key, obj[key]);
  }

  return formData;
}

export function getTableRowNumber(
  index: number,
  currentPage: number,
  perPage: number,
) {
  // currentPage 3
  // perPage 10
  // index 0
  // return 21

  return (currentPage - 1) * perPage + (index + 1);
}

export function isPureObject(input: Object | Record<any, any>) {
  return (
    null !== input &&
    typeof input === "object" &&
    Object.getPrototypeOf(input).isPrototypeOf(Object)
  );

  // return typeof input === 'object' && !Array.isArray(input) && input !== null
}

export const truncateText = (text: string, maxLength: number = 300): string => {
  if (!text || text.length <= maxLength) return text;

  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return (
    (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + "..."
  );
};

export const snakeToCapital = (str: string) => {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const formatDate = (dateString: string) => {
  if (!dateString || !dateString.trim()) return;
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
