package com.jason.employee_creator.employee;

import com.jason.employee_creator.employee.entities.Employee;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
  boolean existsByEmail(String email);
  Optional<Employee> findByEmail(String email);

  boolean existsByEmailAndIdNot(String email, Long id);

  boolean existsByDepartmentId(Long departmentId);
}
