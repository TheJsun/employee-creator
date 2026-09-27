package com.jason.employee_creator.department.dtos;

import jakarta.validation.constraints.Pattern;

public class UpdateDepartmentRequest {

  @Pattern(regexp = ".*\\S.*", message = "Name cannot be empty")
  private String name;

  public UpdateDepartmentRequest() {}

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}
