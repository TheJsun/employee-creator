import { useNavigate, useParams } from "react-router-dom";
import { useEmployee } from "../../hooks/useEmployees";
import EmployeeDetailsHeader from "../../components/Header/EmployeeDetailsHeader";
import classes from "./EmployeeDetailsPage.module.scss";
import { useEmployeeActions } from "../../hooks/useEmployeeActions";
import { DetailsSection } from "../../components/DetailsSection/DetailsSection";
import { Tabs } from "../../components/Tabs/Tabs";
import {
  formatContractType,
  formatEmploymentType,
  formatStartDate,
} from "../../services/employee-profile";

export function EmployeeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const employeeId = id ? Number(id) : undefined;
  const { data: employee, isLoading, isError } = useEmployee(employeeId!);
  const { handleDelete, handleEdit, isDeleting, isDeleteError } =
    useEmployeeActions();

  const handleDeleteAndRedirect = (employeeId: number) => {
    handleDelete(employeeId, () => navigate("/"));
  };

  const contactPlaceholderFields = [
    { label: "Work email", value: "" },
    { label: "Mobile", value: "" },
    { label: "Address", value: "" },
  ];

  const employmentPlaceholderFields = [
    { label: "Type", value: "" },
    { label: "Contract", value: "" },
    { label: "Term", value: "" },
  ];

  const renderBody = () => {
    if (isError) {
      return <p className={classes.loadingMessage}>Could not load employee.</p>;
    }

    if (!employee) {
      return (
        <section className={classes.pageContainer}>
          <section className={classes.detailsContainer}>
            <Tabs
              tabs={[
                { id: "details", label: "Details" },
                { id: "documents", label: "Documents", disabled: true },
              ]}
              activeTabId="details"
            />
            <DetailsSection
              title="Contact"
              fields={contactPlaceholderFields}
              isLoading
            />
            <DetailsSection
              title="Employment"
              fields={employmentPlaceholderFields}
              isLoading
            />
          </section>
        </section>
      );
    }

    const contactFields = [
      { label: "Work email", value: employee.email },
      { label: "Mobile", value: employee.phoneNumber },
      { label: "Address", value: employee.address },
    ];

    const term = employee.onGoing
      ? `${formatStartDate(employee.startDate)} - Ongoing`
      : employee.finishDate
        ? `${formatStartDate(employee.startDate)} - ${formatStartDate(employee.finishDate)}`
        : formatStartDate(employee.startDate);

    const employmentFields = [
      {
        label: "Type",
        value: `${formatEmploymentType(employee.employmentType)} · ${employee.hoursPerWeek} hours per week`,
      },
      { label: "Contract", value: formatContractType(employee.contractType) },
      { label: "Term", value: term },
    ];

    return (
      <>
        <section className={classes.pageContainer}>
          <section className={classes.detailsContainer}>
            <Tabs
              tabs={[
                { id: "details", label: "Details" },
                { id: "documents", label: "Documents", disabled: true },
              ]}
              activeTabId="details"
            />
            <DetailsSection title="Contact" fields={contactFields} />
            <DetailsSection title="Employment" fields={employmentFields} />
          </section>
        </section>

        {isDeleting && <p>Deleting employee...</p>}
        {isDeleteError && (
          <p className={classes.errorMessage}>
            Failed to delete employee. Please try again.
          </p>
        )}
      </>
    );
  };

  return (
    <main>
      <EmployeeDetailsHeader
        employee={employee}
        onEdit={handleEdit}
        isLoading={isLoading}
        onDelete={handleDeleteAndRedirect}
      />
      {renderBody()}
    </main>
  );
}
