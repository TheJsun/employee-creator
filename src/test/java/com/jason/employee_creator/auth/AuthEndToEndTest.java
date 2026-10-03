package com.jason.employee_creator.auth;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.jason.employee_creator.employee.entities.Employee;
import com.jason.employee_creator.support.ApiIntegrationTest;
import com.jason.employee_creator.user.Role;
import io.restassured.http.ContentType;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

public class AuthEndToEndTest extends ApiIntegrationTest {

  @Test
  public void login_validCredentials_returnsOkAndSession() {
    Employee employee = persistEmployee("Ada", "ada@example.com");
    createUser(ADMIN_EMAIL, Role.ADMIN, employee);

    given()
      .contentType(ContentType.JSON)
      .body(Map.of("email", ADMIN_EMAIL, "password", PASSWORD))
      .when()
      .post("/api/auth/login")
      .then()
      .log()
      .body()
      .statusCode(HttpStatus.OK.value())
      .cookie(SESSION_COOKIE, notNullValue())
      .body("email", equalTo(ADMIN_EMAIL))
      .body("role", equalTo("ADMIN"))
      .body("userId", notNullValue())
      .body("employeeId", equalTo(employee.getId().intValue()));
  }

  @Test
  public void login_userWithoutEmployeeRecord_returnsNullEmployeeId() {
    createUser(EMPLOYEE_EMAIL, Role.EMPLOYEE, null);

    given()
      .contentType(ContentType.JSON)
      .body(Map.of("email", EMPLOYEE_EMAIL, "password", PASSWORD))
      .when()
      .post("/api/auth/login")
      .then()
      .statusCode(HttpStatus.OK.value())
      .body("role", equalTo("EMPLOYEE"))
      .body("employeeId", nullValue());
  }

  @Test
  public void login_emailCasingIsIgnored() {
    createUser(EMPLOYEE_EMAIL, Role.EMPLOYEE, null);

    given()
      .contentType(ContentType.JSON)
      .body(
        Map.of("email", EMPLOYEE_EMAIL.toUpperCase(), "password", PASSWORD)
      )
      .when()
      .post("/api/auth/login")
      .then()
      .statusCode(HttpStatus.OK.value())
      .body("email", equalTo(EMPLOYEE_EMAIL));
  }

  /**
   * Regression test: the handler used to catch the SASL AuthenticationException
   * rather than Spring Security's, so a bad password returned 500.
   */
  @Test
  public void login_wrongPassword_returnsUnauthorized() {
    createUser(ADMIN_EMAIL, Role.ADMIN, null);

    given()
      .contentType(ContentType.JSON)
      .body(Map.of("email", ADMIN_EMAIL, "password", "not-the-password"))
      .when()
      .post("/api/auth/login")
      .then()
      .log()
      .body()
      .statusCode(HttpStatus.UNAUTHORIZED.value())
      .body("status", equalTo(HttpStatus.UNAUTHORIZED.value()))
      .body("message", equalTo("Invalid email or password"));
  }

  @Test
  public void login_unknownEmail_returnsUnauthorizedWithSameMessage() {
    given()
      .contentType(ContentType.JSON)
      .body(Map.of("email", "nobody@example.com", "password", PASSWORD))
      .when()
      .post("/api/auth/login")
      .then()
      .log()
      .body()
      .statusCode(HttpStatus.UNAUTHORIZED.value())
      // Identical to the wrong-password response so the endpoint cannot be
      // used to discover which emails are registered.
      .body("message", equalTo("Invalid email or password"));
  }

  @Test
  public void login_blankCredentials_returnsBadRequest() {
    given()
      .contentType(ContentType.JSON)
      .body(Map.of("email", "", "password", ""))
      .when()
      .post("/api/auth/login")
      .then()
      .statusCode(HttpStatus.BAD_REQUEST.value());
  }

  /**
   * Logging in on an existing session must issue a new session id. Login runs
   * in a controller rather than a filter, so the rotation is done by hand with
   * ChangeSessionIdAuthenticationStrategy - without it the pre-login id would
   * survive authentication.
   */
  @Test
  public void login_onExistingSession_rotatesSessionId() {
    createUser(ADMIN_EMAIL, Role.ADMIN, null);

    String firstSession = login(ADMIN_EMAIL, PASSWORD);
    assertNotNull(firstSession, "login should set a session cookie");

    String secondSession = given()
      .cookie(SESSION_COOKIE, firstSession)
      .contentType(ContentType.JSON)
      .body(Map.of("email", ADMIN_EMAIL, "password", PASSWORD))
      .when()
      .post("/api/auth/login")
      .then()
      .statusCode(HttpStatus.OK.value())
      .extract()
      .cookie(SESSION_COOKIE);

    assertNotNull(
      secondSession,
      "a new session cookie should be issued on re-login"
    );
    assertNotEquals(
      firstSession,
      secondSession,
      "the session id should be rotated on login"
    );
  }

  @Test
  public void me_noSession_returnsUnauthorized() {
    given()
      .when()
      .get("/api/me")
      .then()
      .statusCode(HttpStatus.UNAUTHORIZED.value());
  }

  @Test
  public void me_withSession_returnsCurrentUser() {
    String session = employeeSession();

    given()
      .cookie(SESSION_COOKIE, session)
      .when()
      .get("/api/me")
      .then()
      .log()
      .body()
      .statusCode(HttpStatus.OK.value())
      .body("email", equalTo(EMPLOYEE_EMAIL))
      .body("role", equalTo("EMPLOYEE"));
  }

  @Test
  public void me_doesNotExposePassword() {
    String session = employeeSession();

    given()
      .cookie(SESSION_COOKIE, session)
      .when()
      .get("/api/me")
      .then()
      .statusCode(HttpStatus.OK.value())
      .body("password", nullValue())
      .body("passwordHash", nullValue());
  }

  @Test
  public void logout_invalidatesSession() {
    String session = adminSession();

    given()
      .cookie(SESSION_COOKIE, session)
      .when()
      .post("/api/auth/logout")
      .then()
      .statusCode(HttpStatus.OK.value());

    given()
      .cookie(SESSION_COOKIE, session)
      .when()
      .get("/api/me")
      .then()
      .statusCode(HttpStatus.UNAUTHORIZED.value());
  }
}
