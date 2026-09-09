import type { EmployeeResponse } from "../../schemas/employee-schema";
import { getAvatarColor, getInitials } from "../../services/employee-profile";
import Button from "../Button/Button";
import classes from "./EmployeeCard.module.scss";

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
  const initials = getInitials(employee.firstName, employee.lastName);
  const avatarColour = getAvatarColor(employee.email);

  return (
    <article className={classes.employeeCard}>
      <div className={classes.employeeIdentity}>
        <div
          className={classes.employeeIdentity__avatar}
          style={{ backgroundColor: avatarColour }}
        >
          <p className={classes.employeeIdentity__initials}>{initials}</p>
        </div>
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
          <p>{employee.fullTimeOrPartTime}</p>
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
          <p>Email:</p>
          <p>{employee.email}</p>
        </div>
        <div className={classes.employeeContacts__row}>
          <p>Number:</p>
          <p>{employee.phoneNumber}</p>
        </div>
      </div>

      {/* <div className={classes.employeeCard__btns}>
        <Button children={<p>Edit</p>} onClick={() => onEdit(employee)} />
        <Button
          children={<p>Remove</p>}
          onClick={() => onDelete(employee.id)}
        />
      </div> */}
    </article>
  );
}
