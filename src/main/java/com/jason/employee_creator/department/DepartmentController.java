package com.jason.employee_creator.department;

import com.jason.employee_creator.department.dtos.CreateDepartmentRequest;
import com.jason.employee_creator.department.dtos.DepartmentResponse;
import com.jason.employee_creator.department.dtos.UpdateDepartmentRequest;
import com.jason.employee_creator.department.entities.Department;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

  private final DepartmentService departmentService;

  public DepartmentController(DepartmentService departmentService) {
    this.departmentService = departmentService;
  }

  @GetMapping()
  public ResponseEntity<List<DepartmentResponse>> findAllDepartments() {
    List<Department> allDepartments = this.departmentService.findAll();
    return ResponseEntity.ok(DepartmentResponse.of(allDepartments));
  }

  @GetMapping("/{id}")
  public ResponseEntity<DepartmentResponse> findDepartmentById(
    @PathVariable Long id
  ) {
    Department foundDepartment = this.departmentService.findById(id);
    return ResponseEntity.ok(DepartmentResponse.of(foundDepartment));
  }

  @PostMapping()
  public ResponseEntity<DepartmentResponse> createDepartment(
    @RequestBody @Valid CreateDepartmentRequest data
  ) {
    Department createdDepartment = this.departmentService.create(data);
    return new ResponseEntity<DepartmentResponse>(
      DepartmentResponse.of(createdDepartment),
      HttpStatus.CREATED
    );
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteDepartmentById(@PathVariable Long id) {
    this.departmentService.deleteById(id);
    return ResponseEntity.noContent().build();
  }

  @PatchMapping("/{id}")
  public ResponseEntity<DepartmentResponse> updateDepartment(
    @Valid @PathVariable Long id,
    @Valid @RequestBody UpdateDepartmentRequest data
  ) {
    Department updated = this.departmentService.update(id, data);
    return ResponseEntity.ok(DepartmentResponse.of(updated));
  }
}
