import { useAuth } from "../context/useAuth";
import { useEmployee } from "./useEmployees";

export function useCurrentEmployee() {
  const { user } = useAuth();

  return useEmployee(user?.employeeId ?? undefined);
}
