package com.jason.employee_creator.common.exceptions;

public class DepartmentInUseException extends RuntimeException {

  public DepartmentInUseException(Long id) {
    super("Department with id = " + id + " is still in use");
  }
}
