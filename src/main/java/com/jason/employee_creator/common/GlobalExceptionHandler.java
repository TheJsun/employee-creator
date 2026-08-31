package com.jason.employee_creator.common;

import com.jason.employee_creator.common.dtos.ApiErrorResponse;
import com.jason.employee_creator.common.exceptions.DuplicateEmailException;
import com.jason.employee_creator.common.exceptions.NotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
  public ResponseEntity<ApiErrorResponse> handleMethodArgumentNotFoundException(
    MethodArgumentNotValidException ex,
    HttpServletRequest req
  ) {
    ApiErrorResponse response = ApiErrorResponse.of(
      HttpStatus.BAD_REQUEST,
      ex.getMessage(),
      req.getRequestURI()
    );
    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
  }
}
