package com.jason.employee_creator.employee;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.jason.employee_creator.common.exceptions.DuplicateFieldException;
import com.jason.employee_creator.common.exceptions.NotFoundException;
import com.jason.employee_creator.employee.dtos.CreateEmployeeRequest;
import com.jason.employee_creator.employee.entities.Employee;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

@ExtendWith(MockitoExtension.class)
public class EmployeeServiceTest {

  @Mock
  private EmployeeRepository repo;

  @Mock
  private ModelMapper mapper;

  @InjectMocks
  private EmployeeService employeeService;

  @Test
  public void findAll_returnsListFromRepository() {
    Employee employee = new Employee();
    employee.setId(1L);

    when(this.repo.findAll()).thenReturn(List.of(employee));
    List<Employee> result = this.employeeService.findAll();

    verify(this.repo).findAll();
    assertEquals(1, result.size());
  }

  @Test
  public void findAll_noEmployees_returnsEmptyList() {
    when(this.repo.findAll()).thenReturn(List.of());
    List<Employee> result = this.employeeService.findAll();
    assertEquals(List.of(), result);
  }

  @Test
  public void findById_employeeExists_returnsEmployee() {
    Employee employee = new Employee();
    employee.setId(1L);

    when(this.repo.findById(1L)).thenReturn(Optional.of(employee));
    Employee result = this.employeeService.findById(1L);

    assertEquals(employee, result);
    verify(this.repo).findById(1L);
  }

  @Test
  public void findById_employeeDoesNotExists_throwsNotFoundException() {
    when(this.repo.findById(1L)).thenReturn(Optional.empty());
    assertThrows(NotFoundException.class, () ->
      this.employeeService.findById(1L)
    );

    verify(this.repo).findById(1L);
  }

  @Test
  public void createEmployee_emailNotUnique_throwsduplicateFieldException() {
    CreateEmployeeRequest data = new CreateEmployeeRequest();
    data.setEmail("testEmail@gmail.com");

    when(this.repo.existsByEmail("testEmail@gmail.com")).thenReturn(true);
    assertThrows(DuplicateFieldException.class, () ->
      this.employeeService.create(data)
    );
    verify(this.repo, never()).saveAndFlush(any(Employee.class));
  }

  @Test
  public void createEmployee_emailIsUnique_createsEmployee() {
    CreateEmployeeRequest data = new CreateEmployeeRequest();
    data.setEmail("testEmail@gmail.com");

    Employee employee = new Employee();

    when(this.repo.existsByEmail("testEmail@gmail.com")).thenReturn(false);
    when(this.mapper.map(data, Employee.class)).thenReturn(employee);
    Employee result = this.employeeService.create(data);

    assertEquals(employee, result);
    verify(this.repo).saveAndFlush(employee);
  }

  @Test
  public void deleteEmployee_employeeDoesNotExist_throwsNotFoundException() {
    when(this.repo.findById(anyLong())).thenReturn(Optional.empty());

    assertThrows(NotFoundException.class, () ->
      this.employeeService.deleteById(1L)
    );
    verify(this.repo, never()).delete(any(Employee.class));
  }

  @Test
  public void deleteEmployee_employeeExists_deletesFromDB() {
    Employee employee = new Employee();
    when(this.repo.findById(anyLong())).thenReturn(Optional.of(employee));

    this.employeeService.deleteById(1L);
    verify(this.repo).delete(employee);
  }
}
