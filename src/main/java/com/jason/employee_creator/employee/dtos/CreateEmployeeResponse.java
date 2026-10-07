package com.jason.employee_creator.employee.dtos;

public record CreateEmployeeResponse(
  EmployeeResponse employee,
  String temporaryPassword
) {
  public static CreateEmployeeResponse of(CreateEmployeeResult result) {
    return new CreateEmployeeResponse(
      EmployeeResponse.of(result.employee()),
      result.temporaryPassword()
    );
  }
}
