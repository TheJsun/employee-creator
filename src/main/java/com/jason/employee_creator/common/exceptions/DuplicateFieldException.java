package com.jason.employee_creator.common.exceptions;

public class DuplicateFieldException extends RuntimeException {

  public DuplicateFieldException(String fieldName, String fieldValue) {
    super(
      "An entity with " + fieldName + " = " + fieldValue + " already exists"
    );
  }
}
