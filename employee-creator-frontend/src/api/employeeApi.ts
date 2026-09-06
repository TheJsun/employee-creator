import type {
  CreateEmployeeRequest,
  EmployeeResponse,
} from "../schemas/employee-schema";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getAllEmployees = async () => {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }
  return (await response.json()) as EmployeeResponse[];
};

export const createEmployee = async (data: CreateEmployeeRequest) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error("Failed to create employee");
  }
  return (await response.json()) as EmployeeResponse;
};

export const deleteEmployee = async (id: number) => {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Failed to delete employee");
  }
};
