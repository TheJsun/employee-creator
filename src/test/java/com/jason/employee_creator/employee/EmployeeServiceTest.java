package com.jason.employee_creator.employee;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.jason.employee_creator.common.exceptions.DuplicateFieldException;
import com.jason.employee_creator.common.exceptions.NotFoundException;
import com.jason.employee_creator.department.DepartmentRepository;
import com.jason.employee_creator.department.entities.Department;
import com.jason.employee_creator.employee.dtos.CreateEmployeeRequest;
import com.jason.employee_creator.employee.entities.Employee;
import com.jason.employee_creator.user.Role;
import com.jason.employee_creator.user.User;
import com.jason.employee_creator.user.UserRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InOrder;
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

  @Mock
  private DepartmentRepository departmentRepository;

  @Mock
  private UserRepository userRepository;

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
    data.setDepartmentId(1L);

    Employee employee = new Employee();
    Department department = new Department();
    department.setId(1L);

    when(this.repo.existsByEmail("testEmail@gmail.com")).thenReturn(false);
    when(this.mapper.map(data, Employee.class)).thenReturn(employee);
    when(this.departmentRepository.findById(1L)).thenReturn(
      Optional.of(department)
    );
    Employee result = this.employeeService.create(data);

    assertEquals(employee, result);
    assertEquals(department, result.getDepartment());
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
    when(this.userRepository.findByEmployeeId(1L)).thenReturn(Optional.empty());

    this.employeeService.deleteById(1L);
    verify(this.repo).delete(employee);
    verify(this.userRepository, never()).delete(any(User.class));
  }

  @Test
  public void deleteEmployee_employeeHasLoginAccount_deletesAccountFirst() {
    Employee employee = new Employee();
    employee.setId(1L);
    User linkedUser = new User(
      "linked@example.com",
      "hash",
      Role.EMPLOYEE,
      employee
    );
    linkedUser.setId(7L);

    when(this.repo.findById(anyLong())).thenReturn(Optional.of(employee));
    when(this.userRepository.findByEmployeeId(1L)).thenReturn(
      Optional.of(linkedUser)
    );

    this.employeeService.deleteById(1L);

    // The login account has to go first - users.employee_id is a foreign key.
    InOrder inOrder = inOrder(this.userRepository, this.repo);
    inOrder.verify(this.userRepository).delete(linkedUser);
    inOrder.verify(this.repo).delete(employee);
  }
}
