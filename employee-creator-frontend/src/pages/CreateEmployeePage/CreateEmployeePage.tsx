import CreateEmployeeForm from "../../components/CreateEmployeeComponents/CreateEmployeeForm/CreateEmployeeForm";
import Header from "../../components/Header/Header";
import { useParams } from "react-router-dom";
import { useEmployee } from "../../hooks/useEmployees";
import classes from "./CreateEmployeePage.module.scss";

const CreateEmployeePage = () => {
  const { id } = useParams<{ id: string }>();
  const employeeId = id ? Number(id) : undefined;
  const isEditMode = employeeId !== undefined;
  const { data: employee, isLoading, isError } = useEmployee(employeeId!);

  const renderBody = () => {
    if (isEditMode) {
      if (isLoading) {
        return <p className={classes.loadingMessage}>Loading employee...</p>;
      }
      if (isError) {
        return (
          <p className={classes.loadingMessage}>Could not load employee.</p>
        );
      }
    }
    return (
      <CreateEmployeeForm
        mode={isEditMode ? "edit" : "create"}
        employeeId={employeeId}
        initialData={isEditMode ? employee : undefined}
      />
    );
  };

  return (
    <main>
      <Header title="Register Form" button="Back" />

      {renderBody()}
    </main>
  );
};

export default CreateEmployeePage;
