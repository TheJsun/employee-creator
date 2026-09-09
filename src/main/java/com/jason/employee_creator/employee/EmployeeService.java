package com.jason.employee_creator.employee;

import com.jason.employee_creator.common.exceptions.DuplicateEmailException;
import com.jason.employee_creator.common.exceptions.NotFoundException;
import com.jason.employee_creator.employee.dtos.CreateEmployeeRequest;
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

  public EmployeeService(EmployeeRepository repo, ModelMapper mapper) {
    this.repo = repo;
    this.mapper = mapper;
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

  public Employee create(CreateEmployeeRequest data) {
    log.info("Attempting to create employee with email={}", data.getEmail());

    if (this.repo.existsByEmail(data.getEmail())) {
      log.warn("Create employee failed - duplicate email={}", data.getEmail());

      throw new DuplicateEmailException(data.getEmail());
    }

    Employee createdEmployee = this.mapper.map(data, Employee.class);
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

  public Employee update(Long id, CreateEmployeeRequest data) {
    Employee existing = findById(id);
    log.info("Before mapping, existing.id={}", existing.getId());
    if (repo.existsByEmailAndIdNot(data.getEmail(), id)) {
      throw new DuplicateEmailException(data.getEmail());
    }
    mapper.map(data, existing);
    log.info("After mapping, existing.id={}", existing.getId());
    log.info("Updated employee with id={} with new data", existing.getId());
    return repo.saveAndFlush(existing);
  }
}
