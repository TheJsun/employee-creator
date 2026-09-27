package com.jason.employee_creator.department.dtos;

import com.jason.employee_creator.department.entities.Department;
import java.util.List;

public record DepartmentResponse(Long id, String name) {
  public static DepartmentResponse of(Department department) {
    return new DepartmentResponse(department.getId(), department.getName());
  }

  public static List<DepartmentResponse> of(List<Department> departments) {
    return departments
      .stream()
      .map(d -> DepartmentResponse.of(d))
      .toList();
  }
}
