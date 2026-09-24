import { useParams } from "react-router-dom";
import { useEmployee } from "../../hooks/useEmployees";
import Header from "../../components/Header/Header";
import classes from "./EmployeeDetailsPage.module.scss";
import { EmployeeAvatar } from "../../components/EmployeeAvatar/EmployeeAvatar";
import { useEmployeeActions } from "../../hooks/useEmployeeActions";
import { MenuDropdown } from "../../components/MenuDropDown/MenuDropDown";
import { DetailsSection } from "../../components/DetailsSection/DetailsSection";

export function EmployeeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const employeeId = id ? Number(id) : undefined;
  const { data: employee, isLoading, isError } = useEmployee(employeeId!);
  const { handleDelete, handleEdit, isDeleting } = useEmployeeActions();

  if (isLoading) {
    return <p className={classes.loadingMessage}>Loading employee...</p>;
  }
  if (isError || !employee) {
    return <p className={classes.loadingMessage}>Could not load employee.</p>;
  }

  const contactFields = [
    { label: "Email address", value: employee.email },
    { label: "Mobile number", value: employee.phoneNumber },
    { label: "Residential address", value: employee.address },
  ];

  const employmentFields = [
    { label: "Employee type", value: employee.fullTimeOrPartTime },
    { label: "Contract type", value: employee.contractType },
    { label: "Start date", value: employee.startDate },
    {
      label: "Finish date",
      value: employee.onGoing ? "On-going" : employee.finishDate,
    },
    { label: "Hours per week", value: employee.hoursPerWeek },
  ];

  return (
    <main>
      <Header title="Employee Details" button="Back" />
      <section className={classes.pageContainer}>
        <section className={classes.detailsContainer}>
          <article className={classes.employeeCard}>
            <EmployeeAvatar size="md" employee={employee} />
            <div className={classes.employeeCard__text}>
              <h1 className={classes.employeeCard__name}>
                {employee?.firstName} {employee?.middleName}{" "}
                {employee?.lastName}
              </h1>
              <p className={classes.employeeCard__subtext}>Employee Profile</p>
            </div>
            <MenuDropdown
              employee={employee}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </article>
          <DetailsSection title="Contact Details" fields={contactFields} />
          <DetailsSection
            title="Employment Details"
            fields={employmentFields}
          />
        </section>
      </section>

      {isDeleting && <p>Deleting employee...</p>}
    </main>
  );
}
