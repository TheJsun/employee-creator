package com.jason.employee_creator.employee;

import com.jason.employee_creator.common.exceptions.DuplicateEmailException;
import com.jason.employee_creator.common.exceptions.NotFoundException;
import com.jason.employee_creator.employee.dtos.CreateEmployeeRequest;
import com.jason.employee_creator.employee.entities.Employee;
import java.util.List;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
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
    if (this.repo.existsByEmail(data.getEmail())) {
      throw new DuplicateEmailException(data.getEmail());
    }

    Employee createdEmployee = this.mapper.map(data, Employee.class);
    this.repo.saveAndFlush(createdEmployee);
    return createdEmployee;
  }

  public void deleteById(Long id) {
    Employee target = this.findById(id);

    this.repo.delete(target);
  }
}
