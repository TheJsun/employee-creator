import type {
  CreateEmployeeInput,
  EmployeeResponse,
} from "../schemas/employee-schema";

export function toFormData(employee: EmployeeResponse): CreateEmployeeInput {
  return {
    firstName: employee.firstName,
    lastName: employee.lastName,
    middleName: employee.middleName ?? "",
    email: employee.email,
    phoneNumber: employee.phoneNumber,
    address: employee.address,
    jobRole: employee.jobRole,
    departmentId: employee.department.id,
    contractType: employee.contractType,
    startDate: employee.startDate,
    finishDate: employee.finishDate ?? undefined,
    onGoing: employee.onGoing,
    employmentType: employee.employmentType,
    hoursPerWeek: employee.hoursPerWeek,
  };
}
