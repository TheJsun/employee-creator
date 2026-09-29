package com.jason.employee_creator.employee;

import static io.restassured.RestAssured.given;
import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;
import static org.hamcrest.Matchers.*;

import com.jason.employee_creator.employee.dtos.CreateEmployeeRequest;
import com.jason.employee_creator.employee.entities.ContractType;
import com.jason.employee_creator.employee.entities.Employee;
import com.jason.employee_creator.employee.entities.EmploymentType;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import java.time.LocalDate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.jdbc.Sql;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Sql(
  scripts = "/sql/cleanup.sql",
  executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD
)
public class EmployeeEndToEndTest {

  @LocalServerPort
  private int port;

  @Autowired
  private EmployeeRepository employeeRepository;

  @BeforeEach
  public void setup() {
    RestAssured.port = this.port;
  }

  //Tests for Getting Employees

  @Test
  public void getAllEmployees_noEmployeesInDB_returnOkAndEmptyArray() {
    given()
      .when()
      .get("/api/employees")
      .then()
      .log()
      .body()
      .statusCode(HttpStatus.OK.value())
      .body("$", hasSize(0));
  }

  @Test
  public void getAllEmployee_employeesInDB_returnsOkAndArrayOfEmployees() {
    Employee employee1 = new Employee();
    employee1.setFirstName("Jane");
    employee1.setLastName("Doe");
    employee1.setMiddleName("Marie");
    employee1.setEmail("jane.doe@example.com");
    employee1.setPhoneNumber("0412345678");
    employee1.setAddress("123 Example Street, Melbourne VIC 3000");
    employee1.setContractType(ContractType.PERMANENT);
    employee1.setStartDate(LocalDate.of(2024, 1, 15));
    employee1.setFinishDate(null);
    employee1.setOnGoing(true);
    employee1.setEmploymentType(EmploymentType.FULL_TIME);
    employee1.setHoursPerWeek(38);
    employeeRepository.saveAndFlush(employee1);

    Employee employee2 = new Employee();
    employee2.setFirstName("John");
    employee2.setLastName("Smith");
    employee2.setMiddleName(null);
    employee2.setEmail("john.smith@example.com");
    employee2.setPhoneNumber("0498765432");
    employee2.setAddress("456 Sample Ave, Sydney NSW 2000");
    employee2.setContractType(ContractType.CONTRACT);
    employee2.setStartDate(LocalDate.of(2023, 6, 1));
    employee2.setFinishDate(LocalDate.of(2024, 6, 1));
    employee2.setOnGoing(false);
    employee2.setEmploymentType(EmploymentType.PART_TIME);
    employee2.setHoursPerWeek(20);
    employeeRepository.saveAndFlush(employee2);

    given()
      .when()
      .get("/api/employees")
      .then()
      .log()
      .body()
      .statusCode(HttpStatus.OK.value())
      .body("$", hasSize(2))
      .body("firstName", hasItems("Jane", "John"))
      .body("lastName", hasItems("Doe", "Smith"))
      .body("middleName", hasItem("Marie"))
      .body("email", hasItems("jane.doe@example.com", "john.smith@example.com"))
      .body("phoneNumber", hasItems("0412345678", "0498765432"))
      .body(
        "address",
        hasItems(
          "123 Example Street, Melbourne VIC 3000",
          "456 Sample Ave, Sydney NSW 2000"
        )
      )
      .body("contractType", hasItems("PERMANENT", "CONTRACT"))
      .body("startDate", hasItems("2024-01-15", "2023-06-01"))
      .body("finishDate", hasItem("2024-06-01"))
      .body("onGoing", hasItems(true, false))
      .body("employmentType", hasItems("FULL_TIME", "PART_TIME"))
      .body("hoursPerWeek", hasItems(38, 20))
      .body(matchesJsonSchemaInClasspath("schemas/employee-list-schema.json"));
  }

  //Tests for Creating Employees
  @Test
  public void createEmployee_validDTO_created() {
    CreateEmployeeRequest dto = new CreateEmployeeRequest();
    dto.setFirstName("validFirstName");
    dto.setLastName("validLastName");
    dto.setMiddleName("validMiddleName");
    dto.setEmail("validEmail@gmail.com");
    dto.setPhoneNumber("0412345678");
    dto.setAddress("123 Example Street, Melbourne VIC 3000");
    dto.setContractType(ContractType.CONTRACT);
    dto.setStartDate(LocalDate.of(2023, 6, 1));
    dto.setFinishDate(LocalDate.of(2024, 6, 1));
    dto.setOnGoing(false);
    dto.setEmploymentType(EmploymentType.PART_TIME);
    dto.setHoursPerWeek(30);

    given()
      .contentType(ContentType.JSON)
      .body(dto)
      .when()
      .post("/api/employees")
      .then()
      .log()
      .body()
      .statusCode(HttpStatus.CREATED.value())
      .body("firstName", equalTo("validFirstName"))
      .body("lastName", equalTo("validLastName"))
      .body("middleName", equalTo("validMiddleName"))
      .body("email", equalTo("validEmail@gmail.com"))
      .body("phoneNumber", equalTo("0412345678"))
      .body("address", equalTo("123 Example Street, Melbourne VIC 3000"))
      .body("contractType", equalTo("CONTRACT"))
      .body("startDate", equalTo("2023-06-01"))
      .body("finishDate", equalTo("2024-06-01"))
      .body("onGoing", equalTo(false))
      .body("employmentType", equalTo("PART_TIME"))
      .body("hoursPerWeek", equalTo(30))
      .body(matchesJsonSchemaInClasspath("schemas/employee-schema.json"));
  }

  @Test
  public void createEmployee_invalidDTO_badRequest() {
    CreateEmployeeRequest dto = new CreateEmployeeRequest();
    dto.setFirstName("");
    dto.setLastName("");
    dto.setMiddleName(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    );
    dto.setEmail("not-an-email");
    dto.setPhoneNumber("");
    dto.setAddress("");
    dto.setContractType(null);
    dto.setStartDate(null);
    dto.setFinishDate(null);
    dto.setOnGoing(null);
    dto.setEmploymentType(null);
    dto.setHoursPerWeek(-10);

    given()
      .contentType(ContentType.JSON)
      .body(dto)
      .when()
      .post("/api/employees")
      .then()
      .log()
      .body()
      .statusCode(HttpStatus.BAD_REQUEST.value())
      .body("details.employmentType", hasItem("must not be null"))
      .body("details.firstName", hasItem("must not be blank"))
      .body("details.lastName", hasItem("must not be blank"))
      .body("details.phoneNumber", hasItem("must not be blank"))
      .body(
        "details.hoursPerWeek",
        hasItem("must be greater than or equal to 1")
      )
      .body("details.address", hasItem("must not be blank"))
      .body("details.contractType", hasItem("must not be null"))
      .body("details.middleName", hasItem("size must be between 0 and 50"))
      .body("details.email", hasItem("must be a well-formed email address"))
      .body("details.onGoing", hasItem("must not be null"))
      .body("details.startDate", hasItem("must not be null"))
      .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
  }

  @Test
  public void createEmployee_duplicateField_returnsConflict() {
    Employee employee1 = new Employee();
    employee1.setFirstName("Jane");
    employee1.setLastName("Doe");
    employee1.setMiddleName("Marie");
    employee1.setEmail("jane.doe@example.com");
    employee1.setPhoneNumber("0412345678");
    employee1.setAddress("123 Example Street, Melbourne VIC 3000");
    employee1.setContractType(ContractType.PERMANENT);
    employee1.setStartDate(LocalDate.of(2024, 1, 15));
    employee1.setFinishDate(null);
    employee1.setOnGoing(true);
    employee1.setEmploymentType(EmploymentType.FULL_TIME);
    employee1.setHoursPerWeek(38);
    employeeRepository.saveAndFlush(employee1);

    CreateEmployeeRequest employee2 = new CreateEmployeeRequest();
    employee2.setFirstName("John");
    employee2.setLastName("Smith");
    employee2.setMiddleName(null);
    employee2.setEmail("jane.doe@example.com");
    employee2.setPhoneNumber("0498765432");
    employee2.setAddress("456 Sample Ave, Sydney NSW 2000");
    employee2.setContractType(ContractType.CONTRACT);
    employee2.setStartDate(LocalDate.of(2023, 6, 1));
    employee2.setFinishDate(LocalDate.of(2024, 6, 1));
    employee2.setOnGoing(false);
    employee2.setEmploymentType(EmploymentType.PART_TIME);
    employee2.setHoursPerWeek(20);

    given()
      .contentType(ContentType.JSON)
      .body(employee2)
      .when()
      .post("/api/employees")
      .then()
      .log()
      .body()
      .statusCode(HttpStatus.CONFLICT.value())
      .body("status", equalTo(HttpStatus.CONFLICT.value()))
      .body("message", containsString("jane.doe@example.com"))
      .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
  }

  //Tests for Deleting Employee
  @Test
  public void deleteEmployee_employeeInDB_deleted() {
    Employee employee1 = new Employee();
    employee1.setFirstName("Jane");
    employee1.setLastName("Doe");
    employee1.setMiddleName("Marie");
    employee1.setEmail("jane.doe@example.com");
    employee1.setPhoneNumber("0412345678");
    employee1.setAddress("123 Example Street, Melbourne VIC 3000");
    employee1.setContractType(ContractType.PERMANENT);
    employee1.setStartDate(LocalDate.of(2024, 1, 15));
    employee1.setFinishDate(null);
    employee1.setOnGoing(true);
    employee1.setEmploymentType(EmploymentType.FULL_TIME);
    employee1.setHoursPerWeek(38);
    employeeRepository.saveAndFlush(employee1);

    given()
      .when()
      .delete("api/employees/" + employee1.getId())
      .then()
      .log()
      .body()
      .statusCode(HttpStatus.NO_CONTENT.value());
  }

  @Test
  public void deleteTodo_todoNotInDB_NotFound() {
    given()
      .when()
      .delete("/api/employees/1")
      .then()
      .log()
      .body()
      .statusCode(HttpStatus.NOT_FOUND.value())
      .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
  }
}
