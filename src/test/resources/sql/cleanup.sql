-- Delete in foreign-key order: users.employee_id -> employees.department_id
DELETE FROM users;
DELETE FROM employees;
DELETE FROM department;
