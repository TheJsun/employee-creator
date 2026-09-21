import { useEffect, useRef, useState } from "react";
import type { EmployeeResponse } from "../../schemas/employee-schema";
import classes from "./EmployeeCard.module.scss";
import { EmployeeAvatar } from "../EmployeeAvatar/EmployeeAvatar";
import { MenuDropdown } from "../MenuDropDown/MenuDropDown";

interface EmployeeCardProps {
  employee: EmployeeResponse;
  onDelete: (id: number) => void;
  onEdit: (employee: EmployeeResponse) => void;
}

export default function EmployeeCard({
  employee,
  onDelete,
  onEdit,
}: EmployeeCardProps) {
  return (
    <article className={classes.employeeCard}>
      <div className={classes.employeeIdentity}>
        <EmployeeAvatar employee={employee} />
        <p className={classes.employeeIdentity__name}>
          {employee.firstName} {employee?.middleName} {employee.lastName}
        </p>
      </div>

      <div className={classes.employmentDetails}>
        <div className={classes.employmentDetails__row}>
          <p>Contract Type:</p>
          <p>{employee.contractType}</p>
        </div>
        <div className={classes.employmentDetails__row}>
          <p>Employment Type</p>
          <p>{employee.fullTimeOrPartTime.replace(/_/g, " ")}</p>
        </div>
        <div className={classes.employmentDetails__row}>
          <p>Start Date:</p>
          <p>{employee.startDate}</p>
        </div>
        <div className={classes.employmentDetails__row}>
          <p>Finish date:</p>
          {employee.onGoing ? <p>On-going</p> : <p>{employee.finishDate}</p>}
        </div>
      </div>

      <div className={classes.employeeContacts}>
        <div className={classes.employeeContacts__row}>
          <img
            width="15"
            height="15"
            src="https://img.icons8.com/fluency-systems-regular/48/new-post.png"
            alt="new-post"
          />
          <p>{employee.email}</p>
        </div>
        <div className={classes.employeeContacts__row}>
          <img
            width="15"
            height="15"
            src="https://img.icons8.com/fluency-systems-regular/48/phone.png"
            alt="phone"
          />
          <p>{employee.phoneNumber}</p>
        </div>
      </div>
      <MenuDropdown employee={employee} onDelete={onDelete} onEdit={onEdit} />
    </article>
  );
}
