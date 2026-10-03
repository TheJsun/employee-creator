package com.jason.employee_creator.employee;

import com.jason.employee_creator.common.exceptions.DuplicateFieldException;
import com.jason.employee_creator.common.exceptions.NotFoundException;
import com.jason.employee_creator.common.exceptions.UnprocessableContentException;
import com.jason.employee_creator.department.DepartmentRepository;
import com.jason.employee_creator.department.entities.Department;
import com.jason.employee_creator.employee.dtos.CreateEmployeeRequest;
import com.jason.employee_creator.employee.dtos.UpdateEmployeeRequest;
import com.jason.employee_creator.employee.entities.Employee;
import com.jason.employee_creator.user.CurrentUser;
import com.jason.employee_creator.user.User;
import com.jason.employee_creator.user.UserRepository;
import java.util.List;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class EmployeeService {

  private final EmployeeRepository repo;
  private final ModelMapper mapper;
  private final DepartmentRepository departmentRepository;
  private final UserRepository userRepository;

  public EmployeeService(
    EmployeeRepository repo,
    ModelMapper mapper,
    DepartmentRepository departmentRepository,
    UserRepository userRepository
  ) {
    this.repo = repo;
    this.mapper = mapper;
    this.departmentRepository = departmentRepository;
    this.userRepository = userRepository;
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

  @PreAuthorize("hasRole('ADMIN')")
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

  @PreAuthorize("hasRole('ADMIN')")
  @Transactional
  public void deleteById(Long id) {
    log.info("Attempting to delete employee id={}", id);

    Employee target = this.findById(id);

    // users.employee_id is a foreign key, so a linked login account has to go
    // first or the delete fails with a constraint violation.
    Optional<User> linkedUser = this.userRepository.findByEmployeeId(id);
    if (linkedUser.isPresent()) {
      User user = linkedUser.get();

      if (isCurrentUser(user)) {
        log.warn("Refused self-deletion of user id={}", user.getId());
        throw new UnprocessableContentException(
          "You cannot delete your own employee record"
        );
      }

      this.userRepository.delete(user);
      log.info("Deleted login account id={} for employee id={}", user.getId(), id);
    }

    this.repo.delete(target);
    log.info("Deleted employee id={}", id);
  }

  private boolean isCurrentUser(User user) {
    Authentication authentication = SecurityContextHolder.getContext()
      .getAuthentication();
    if (authentication == null) {
      return false;
    }
    return (
      authentication.getPrincipal() instanceof CurrentUser currentUser &&
      currentUser.getId().equals(user.getId())
    );
  }

  @PreAuthorize("hasRole('ADMIN')")
  public Employee update(Long id, UpdateEmployeeRequest data) {
    Employee existing = findById(id);
    if (
      data.getEmail() != null && repo.existsByEmailAndIdNot(data.getEmail(), id)
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
