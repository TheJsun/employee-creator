import { z } from "zod";

export interface DepartmentResponse {
  id: number;
  name: string;
}

export const CreateDepartmentRequest = z.object({
  name: z.string().min(1, "Department name is required").max(50),
});

export type CreateDepartmentRequest = z.infer<typeof CreateDepartmentRequest>;
