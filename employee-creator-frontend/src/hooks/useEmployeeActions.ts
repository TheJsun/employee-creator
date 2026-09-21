import { useNavigate } from "react-router-dom";
import { useDeleteEmployee } from "./useEmployees";
import type { EmployeeResponse } from "../schemas/employee-schema";

export function useEmployeeActions() {
  const navigate = useNavigate();
  const deleteEmployeeMutation = useDeleteEmployee();

  const handleEdit = (employee: EmployeeResponse) => {
    navigate(`/employees/edit/${employee.id}`);
  };

  const handleDelete = (id: number, onDeleted?: () => void) => {
    deleteEmployeeMutation.mutate(id, { onSuccess: onDeleted });
  };

  return {
    handleEdit,
    handleDelete,
    isDeleting: deleteEmployeeMutation.isPending,
  };
}
