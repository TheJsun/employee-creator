import { useParams } from "react-router-dom";
import { useEmployee } from "../../hooks/useEmployees";
import Header from "../../components/Header/Header";
import classes from "./EmployeeDetailsPage.module.scss";
import { EmployeeAvatar } from "../../components/EmployeeAvatar/EmployeeAvatar";
import { useEmployeeActions } from "../../hooks/useEmployeeActions";
import { MenuDropdown } from "../../components/MenuDropDown/MenuDropDown";

export function EmployeeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const employeeId = id ? Number(id) : undefined;
  const { data: employee, isLoading, isError } = useEmployee(employeeId!);
  const { handleDelete, handleEdit, isDeleting } = useEmployeeActions();

  console.log(employee);

  if (isLoading) {
    return <p className={classes.loadingMessage}>Loading employee...</p>;
  }
  if (isError || !employee) {
    return <p className={classes.loadingMessage}>Could not load employee.</p>;
  }

  return (
    <>
      <Header title="Employee Details" button="Back" />
      <div className={classes.employeeCard}>
        <EmployeeAvatar employee={employee} />
        <div className={classes.employeeCard__text}>
          <h1>
            {employee?.firstName} {employee?.middleName} {employee?.lastName}
          </h1>
          <p>Employee Profile</p>
        </div>
        <MenuDropdown
          employee={employee}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>

      {isDeleting && <p>Deleting employee...</p>}
    </>
  );
}
