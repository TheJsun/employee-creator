package com.jason.employee_creator.employee;

import com.jason.employee_creator.common.exceptions.DuplicateFieldException;
import com.jason.employee_creator.common.exceptions.NotFoundException;
import com.jason.employee_creator.common.exceptions.UnprocessableContentException;
import com.jason.employee_creator.department.DepartmentRepository;
import com.jason.employee_creator.department.entities.Department;
import com.jason.employee_creator.employee.dtos.CreateEmployeeRequest;
import com.jason.employee_creator.employee.dtos.UpdateEmployeeRequest;
import com.jason.employee_creator.employee.entities.Employee;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmployeeService {

  private final EmployeeRepository repo;
  private final ModelMapper mapper;
  private final DepartmentRepository departmentRepository;

  public EmployeeService(
    EmployeeRepository repo,
    ModelMapper mapper,
    DepartmentRepository departmentRepository
  ) {
    this.repo = repo;
    this.mapper = mapper;
    this.departmentRepository = departmentRepository;
  }

  public List<Employee> findAll() {
    return this.repo.findAll();
  }

  public Employee findById(Long id) {
    return this.repo
      .findById(id)
      .orElseThrow(() ->
        new NotFoundException("Could not find Employee with id = " + id)
      );
  }

  private Department resolveDepartment(Long id) {
    Department departmentResult = this.departmentRepository
      .findById(id)
      .orElseThrow(() ->
        new UnprocessableContentException(
          "No department exists with id = " + id
        )
      );
    return departmentResult;
  }

  public Employee create(CreateEmployeeRequest data) {
    log.info("Attempting to create employee with email={}", data.getEmail());

    if (this.repo.existsByEmail(data.getEmail())) {
      log.warn("Create employee failed - duplicate email={}", data.getEmail());

      throw new DuplicateFieldException("email", data.getEmail());
    }

    Employee createdEmployee = this.mapper.map(data, Employee.class);
    Department foundDepartment = resolveDepartment(data.getDepartmentId());
    createdEmployee.setDepartment(foundDepartment);
    this.repo.saveAndFlush(createdEmployee);
    log.info(
      "Created employee id={} email={}",
      createdEmployee.getId(),
      createdEmployee.getEmail()
    );

    return createdEmployee;
  }

  public void deleteById(Long id) {
    log.info("Attempting to delete employee id={}", id);

    Employee target = this.findById(id);

    this.repo.delete(target);
    log.info("Deleted employee id={}", id);
  }

  public Employee update(Long id, UpdateEmployeeRequest data) {
    Employee existing = findById(id);
    if (
      data.getEmail() != null &&
      repo.existsByEmailAndIdNot(data.getEmail(), id)
    ) {
      throw new DuplicateFieldException("email", data.getEmail());
    }
    mapper.map(data, existing);
    if (data.getDepartmentId() != null) {
      Department foundDepartment = resolveDepartment(data.getDepartmentId());
      existing.setDepartment(foundDepartment);
    }
    log.info("Updated employee with id={} with new data", existing.getId());
    return repo.saveAndFlush(existing);
  }
}
