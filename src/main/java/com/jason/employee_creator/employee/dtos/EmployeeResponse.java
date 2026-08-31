package com.jason.employee_creator.employee.dtos;

import com.jason.employee_creator.employee.entities.ContractType;
import com.jason.employee_creator.employee.entities.Employee;
import com.jason.employee_creator.employee.entities.FullTimeOrPartTime;
import java.time.LocalDate;

public record EmployeeResponse(
  Long id,
  String firstName,
  String lastName,
  String middleName,
  String email,
  String phoneNumber,
  String address,
  ContractType contractType,
  LocalDate starDate,
  LocalDate finishDate,
  Boolean isOnGoing,
  FullTimeOrPartTime fullTimeOrPartTime,
  Integer hoursPerWeek
) {
  public static EmployeeResponse of(Employee employee) {
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
      employee.getIsOnGoing(),
      employee.getFullTimeOrPartTime(),
      employee.getHoursPerWeek()
    );
  }
}
