import { z } from "zod";

export type ContractType = "PERMANENT" | "CONTRACT";
export type FullTimeOrPartTime = "FULL_TIME" | "PART_TIME";

export interface EmployeeResponse {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  email: string;
  phoneNumber: string;
  address: string;
  contractType: ContractType;
  startDate: string;
  finishDate: string | null;
  onGoing: boolean;
  fullTimeOrPartTime: FullTimeOrPartTime;
  hoursPerWeek: number;
}

export const CreateEmployeeRequest = z
  .object({
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    middleName: z.string().max(50).optional(),
    email: z
      .email("Invalid email")
      .min(1, "Email is required")
      .max(50, "Email must be 40 characters or fewer"),
    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .length(10, "Must be a valid phone number"),
    address: z.string().min(1, "Address is required").max(100),
    contractType: z.enum(["PERMANENT", "CONTRACT"]),
    startDate: z.string().min(1, "Start date is required"),
    finishDate: z.string().optional().nullable(),
    onGoing: z.boolean(),
    fullTimeOrPartTime: z.enum(["FULL_TIME", "PART_TIME"]),
    hoursPerWeek: z
      .number()
      .int()
      .min(1, "Must be at least 1 hour")
      .max(168, "Must be 168 hours or fewer"),
  })
  .refine(
    (data) => {
      const hasFinishDate = !!data.finishDate;
      return data.onGoing !== hasFinishDate;
    },
    {
      message: "Select 'Ongoing' or provide a finish date",
      path: ["finishDate"],
    },
  )
  .refine(
    (data) => {
      if (!data.finishDate) return true;
      return new Date(data.finishDate) >= new Date(data.startDate);
    },
    {
      message: "Finish date cannot be earlier than start date",
      path: ["finishDate"],
    },
  );

export type CreateEmployeeRequest = z.infer<typeof CreateEmployeeRequest>;
