package com.jason.employee_creator.employee;

import com.jason.employee_creator.employee.dtos.CreateEmployeeRequest;
import com.jason.employee_creator.employee.dtos.CreateEmployeeResponse;
import com.jason.employee_creator.employee.dtos.CreateEmployeeResult;
import com.jason.employee_creator.employee.dtos.EmployeeResponse;
import com.jason.employee_creator.employee.dtos.UpdateEmployeeRequest;
import com.jason.employee_creator.employee.entities.Employee;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

  private final EmployeeService employeeService;

  public EmployeeController(EmployeeService employeeService) {
    this.employeeService = employeeService;
  }

  @GetMapping()
  public ResponseEntity<List<EmployeeResponse>> findAllEmployees() {
    List<Employee> allEmployees = this.employeeService.findAll();
    return ResponseEntity.ok(EmployeeResponse.of(allEmployees));
  }

  @GetMapping("/{id}")
  public ResponseEntity<EmployeeResponse> findEmployeeById(
    @PathVariable Long id
  ) {
    Employee foundEmployee = this.employeeService.findById(id);
    return ResponseEntity.ok(EmployeeResponse.of(foundEmployee));
  }

  @PostMapping()
  public ResponseEntity<CreateEmployeeResponse> createEmployee(
    @RequestBody @Valid CreateEmployeeRequest data
  ) {
    CreateEmployeeResult created = this.employeeService.create(data);
    return new ResponseEntity<CreateEmployeeResponse>(
      CreateEmployeeResponse.of(created),
      HttpStatus.CREATED
    );
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteEmployeeById(@PathVariable Long id) {
    this.employeeService.deleteById(id);
    return ResponseEntity.noContent().build();
  }

  @PutMapping("/{id}")
  public ResponseEntity<EmployeeResponse> updateEmployee(
    @PathVariable Long id,
    @RequestBody @Valid UpdateEmployeeRequest data
  ) {
    Employee updated = employeeService.update(id, data);
    return ResponseEntity.ok(EmployeeResponse.of(updated));
  }
}
