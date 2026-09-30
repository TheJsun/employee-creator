import type {
  ContractType,
  EmploymentType,
} from "../schemas/employee-schema";

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function formatEmploymentType(type: EmploymentType): string {
  return type === "FULL_TIME" ? "Full-time" : "Part-time";
}

export function formatContractType(type: ContractType): string {
  return type === "PERMANENT" ? "Permanent" : "Contract";
}

export function formatStartDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const AVATAR_COLORS = [
  "#6366f1", 
  "#ec4899", 
  "#14b8a6", 
  "#f59e0b", 
  "#8b5cf6", 
  "#ef4444", 
  "#0ea5e9", 
  "#10b981", 
];

export function getAvatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}
