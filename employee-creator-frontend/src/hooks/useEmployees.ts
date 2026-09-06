import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createEmployee, getAllEmployees } from "../api/employeeApi";

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: getAllEmployees,
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
