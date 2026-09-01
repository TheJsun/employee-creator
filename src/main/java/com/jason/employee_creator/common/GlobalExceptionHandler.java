package com.jason.employee_creator.common;

import com.jason.employee_creator.common.dtos.ApiErrorResponse;
import com.jason.employee_creator.common.exceptions.DuplicateEmailException;
import com.jason.employee_creator.common.exceptions.NotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<ApiErrorResponse> handleNotFoundException(
    NotFoundException ex,
    HttpServletRequest req
  ) {
    ApiErrorResponse response = ApiErrorResponse.of(
      HttpStatus.NOT_FOUND,
      ex.getMessage(),
      req.getRequestURI()
    );
    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(DuplicateEmailException.class)
  public ResponseEntity<ApiErrorResponse> handleDuplicateEmailException(
    DuplicateEmailException ex,
    HttpServletRequest req
  ) {
    ApiErrorResponse response = ApiErrorResponse.of(
      HttpStatus.CONFLICT,
      ex.getMessage(),
      req.getRequestURI()
    );
    return new ResponseEntity<>(response, HttpStatus.CONFLICT);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiErrorResponse> handleMethodArgumentNotValidException(
    MethodArgumentNotValidException ex,
    HttpServletRequest req
  ) {
    Map<String, ArrayList<String>> errors = new HashMap<>();

    for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
      String field = fieldError.getField();
      String message = fieldError.getDefaultMessage();

      errors.computeIfAbsent(field, k -> new ArrayList<>()).add(message);
    }
    System.out.println("Caught: " + ex.getClass().getName());
    ApiErrorResponse response = ApiErrorResponse.of(
      HttpStatus.BAD_REQUEST,
      ex.getMessage(),
      req.getRequestURI(),
      errors
    );
    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiErrorResponse> handleUnexpected(
    Exception ex,
    HttpServletRequest req
  ) {
    System.out.println("Unhandled exception: " + ex.getClass().getName());
    ApiErrorResponse response = ApiErrorResponse.of(
      HttpStatus.UNPROCESSABLE_CONTENT,
      ex.getMessage(),
      req.getRequestURI()
    );
    return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
