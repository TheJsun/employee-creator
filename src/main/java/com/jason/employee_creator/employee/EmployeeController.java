package com.jason.employee_creator.employee;

import com.jason.employee_creator.common.exceptions.NotFoundException;
import com.jason.employee_creator.employee.dtos.CreateEmployeeRequest;
import com.jason.employee_creator.employee.dtos.EmployeeResponse;
import com.jason.employee_creator.employee.entities.Employee;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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

  @PostMapping()
  public ResponseEntity<EmployeeResponse> createEmployee(
    @RequestBody @Valid CreateEmployeeRequest data
  ) {
    Employee createdEmployee = this.employeeService.create(data);
    return new ResponseEntity<EmployeeResponse>(
      EmployeeResponse.of(createdEmployee),
      HttpStatus.CREATED
    );
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteBookById(@PathVariable Long id) {
    this.employeeService.deleteById(id);
    return ResponseEntity.noContent().build();
  }
}
