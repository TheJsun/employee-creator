import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
} from "../api/employeeApi";

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: getAllEmployees,
  });
}

export function useEmployee(id: number) {
  return useQuery({
    queryKey: ["employees", id],
    queryFn: () => getEmployeeById(id),
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}
