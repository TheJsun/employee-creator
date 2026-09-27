package com.jason.employee_creator.department.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateDepartmentRequest {

  @NotBlank
  @Size(max = 50)
  private String name;

  public CreateDepartmentRequest() {}

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}
