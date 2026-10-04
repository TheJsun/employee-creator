package com.jason.employee_creator.department;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

import com.jason.employee_creator.department.entities.Department;
import com.jason.employee_creator.support.ApiIntegrationTest;
import io.restassured.http.ContentType;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

public class DepartmentAuthorizationTest extends ApiIntegrationTest {

  @Test
  public void departmentEndpoints_noSession_returnUnauthorized() {
    given()
      .when()
      .get("/api/departments")
      .then()
      .statusCode(HttpStatus.UNAUTHORIZED.value());
    given()
      .contentType(ContentType.JSON)
      .body(Map.of("name", "Engineering"))
      .when()
      .post("/api/departments")
      .then()
      .statusCode(HttpStatus.UNAUTHORIZED.value());
    given()
      .when()
      .delete("/api/departments/1")
      .then()
      .statusCode(HttpStatus.UNAUTHORIZED.value());
  }

  @Test
  public void getAllDepartments_anyAuthenticatedUser_returnsOk() {
    String session = employeeSession();
    createDepartment("Engineering");

    given()
      .cookie(SESSION_COOKIE, session)
      .when()
      .get("/api/departments")
      .then()
      .statusCode(HttpStatus.OK.value())
      .body("name", org.hamcrest.Matchers.hasItem("Engineering"));
  }

  @Test
  public void createDepartment_adminRole_returnsCreated() {
    String session = adminSession();

    given()
      .cookie(SESSION_COOKIE, session)
      .contentType(ContentType.JSON)
      .body(Map.of("name", "Engineering"))
      .when()
      .post("/api/departments")
      .then()
      .log()
      .body()
      .statusCode(HttpStatus.CREATED.value())
      .body("name", equalTo("Engineering"));
  }

  @Test
  public void createDepartment_employeeRole_returnsForbidden() {
    String session = employeeSession();

    given()
      .cookie(SESSION_COOKIE, session)
      .contentType(ContentType.JSON)
      .body(Map.of("name", "Engineering"))
      .when()
      .post("/api/departments")
      .then()
      .log()
      .body()
      .statusCode(HttpStatus.FORBIDDEN.value())
      .body("status", equalTo(HttpStatus.FORBIDDEN.value()));
  }

  @Test
  public void updateDepartment_employeeRole_returnsForbidden() {
    String session = employeeSession();
    Department department = createDepartment("Engineering");

    given()
      .cookie(SESSION_COOKIE, session)
      .contentType(ContentType.JSON)
      .body(Map.of("name", "Renamed"))
      .when()
      .patch("/api/departments/" + department.getId())
      .then()
      .statusCode(HttpStatus.FORBIDDEN.value());
  }

  @Test
  public void deleteDepartment_employeeRole_returnsForbidden() {
    String session = employeeSession();
    Department department = createDepartment("Engineering");

    given()
      .cookie(SESSION_COOKIE, session)
      .when()
      .delete("/api/departments/" + department.getId())
      .then()
      .statusCode(HttpStatus.FORBIDDEN.value());
  }

  @Test
  public void deleteDepartment_adminRole_returnsNoContent() {
    String session = adminSession();
    Department department = createDepartment("Engineering");

    given()
      .cookie(SESSION_COOKIE, session)
      .when()
      .delete("/api/departments/" + department.getId())
      .then()
      .statusCode(HttpStatus.NO_CONTENT.value());
  }
}
