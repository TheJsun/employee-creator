package com.jason.employee_creator.employee.dtos;

import com.jason.employee_creator.employee.entities.ContractType;
import com.jason.employee_creator.employee.entities.FullTimeOrPartTime;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class CreateEmployeeRequest {

  @NotBlank
  @Size(max = 50)
  private String firstName;

  @NotBlank
  @Size(max = 50)
  private String lastName;

  @Size(max = 50)
  private String middleName;

  @NotBlank
  @Email
  private String email;

  @NotBlank
  private String phoneNumber;

  @NotBlank
  private String address;

  @NotNull
  private ContractType contractType;

  @NotNull
  private LocalDate startDate;

  private LocalDate finishDate;

  @NotNull
  private Boolean isOnGoing;

  @NotNull
  private FullTimeOrPartTime fullTimeOrPartTime;

  @NotNull
  @Min(1)
  @Max(168)
  private Integer hoursPerWeek;

  public CreateEmployeeRequest() {}

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getMiddleName() {
    return middleName;
  }

  public void setMiddleName(String middleName) {
    this.middleName = middleName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

  public ContractType getContractType() {
    return contractType;
  }

  public void setContractType(ContractType contractType) {
    this.contractType = contractType;
  }

  public LocalDate getStartDate() {
    return startDate;
  }

  public void setStartDate(LocalDate startDate) {
    this.startDate = startDate;
  }

  public LocalDate getFinishDate() {
    return finishDate;
  }

  public void setFinishDate(LocalDate finishDate) {
    this.finishDate = finishDate;
  }

  public Boolean getIsOnGoing() {
    return isOnGoing;
  }

  public void setIsOnGoing(Boolean isOnGoing) {
    this.isOnGoing = isOnGoing;
  }

  public FullTimeOrPartTime getFullTimeOrPartTime() {
    return fullTimeOrPartTime;
  }

  public void setFullTimeOrPartTime(FullTimeOrPartTime fullTimeOrPartTime) {
    this.fullTimeOrPartTime = fullTimeOrPartTime;
  }

  public Integer getHoursPerWeek() {
    return hoursPerWeek;
  }

  public void setHoursPerWeek(Integer hoursPerWeek) {
    this.hoursPerWeek = hoursPerWeek;
  }
}
