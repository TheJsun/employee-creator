import type {
  CreateEmployeeRequest,
  EmployeeResponse,
} from "../schemas/employee-schema";

export function toFormData(employee: EmployeeResponse): CreateEmployeeRequest {
  return {
    firstName: employee.firstName,
    lastName: employee.lastName,
    middleName: employee.middleName ?? undefined,
    email: employee.email,
    phoneNumber: employee.phoneNumber ?? undefined,
    address: employee.address ?? undefined,
    contractType: employee.contractType,
    startDate: employee.startDate,
    finishDate: employee.finishDate ?? undefined,
    onGoing: employee.onGoing,
    employmentType: employee.employmentType,
    hoursPerWeek: employee.hoursPerWeek,
  };
}
