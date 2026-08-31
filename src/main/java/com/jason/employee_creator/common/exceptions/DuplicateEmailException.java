package com.jason.employee_creator.common.exceptions;

public class DuplicateEmailException extends RuntimeException {

  public DuplicateEmailException(String email) {
    super("An employee with email " + email + " already exists");
  }
}
