package com.jason.employee_creator.employee.dtos;

import com.jason.employee_creator.employee.entities.Employee;

public record CreateEmployeeResult(
  Employee employee,
  String temporaryPassword
) {}
