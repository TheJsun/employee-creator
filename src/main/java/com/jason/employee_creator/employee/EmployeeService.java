package com.jason.employee_creator.employee;

import com.jason.employee_creator.employee.dtos.CreateEmployeeRequest;
import com.jason.employee_creator.employee.entities.Employee;
import java.util.List;
import java.util.Optional;
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

  public Optional<Employee> findById(Long id) {
    return this.repo.findById(id);
  }

  public Employee create(CreateEmployeeRequest data) {
    Employee createdEmployee = this.mapper.map(data, Employee.class);
    this.repo.saveAndFlush(createdEmployee);
    return createdEmployee;
  }

  public boolean deleteById(Long id) {
    Optional<Employee> result = this.repo.findById(id);
    if (result.isEmpty()) {
      return false;
    }
    this.repo.delete(result.get());
    return true;
  }
}
