package com.jason.employee_creator.employee.dtos;

import com.jason.employee_creator.department.dtos.DepartmentResponse;
import com.jason.employee_creator.employee.entities.ContractType;
import com.jason.employee_creator.employee.entities.Employee;
import com.jason.employee_creator.employee.entities.FullTimeOrPartTime;
import java.time.LocalDate;
import java.util.List;

public record EmployeeResponse(
  Long id,
  String firstName,
  String lastName,
  String middleName,
  String email,
  String phoneNumber,
  String address,
  ContractType contractType,
  LocalDate startDate,
  LocalDate finishDate,
  Boolean onGoing,
  FullTimeOrPartTime fullTimeOrPartTime,
  Integer hoursPerWeek,
  DepartmentResponse departmentResponse
) {
  public static EmployeeResponse of(Employee employee) {
    DepartmentResponse departmentResponse =
      employee.getDepartment() != null
        ? new DepartmentResponse(
            employee.getDepartment().getId(),
            employee.getDepartment().getName()
          )
        : null;
    return new EmployeeResponse(
      employee.getId(),
      employee.getFirstName(),
      employee.getLastName(),
      employee.getMiddleName(),
      employee.getEmail(),
      employee.getPhoneNumber(),
      employee.getAddress(),
      employee.getContractType(),
      employee.getStartDate(),
      employee.getFinishDate(),
      employee.getOnGoing(),
      employee.getFullTimeOrPartTime(),
      employee.getHoursPerWeek(),
      departmentResponse
    );
  }

  public static List<EmployeeResponse> of(List<Employee> employees) {
    return employees
      .stream()
      .map(e -> EmployeeResponse.of(e))
      .toList();
  }
}
