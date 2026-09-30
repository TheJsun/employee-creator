import CreateEmployeeForm from "../../components/CreateEmployeeComponents/CreateEmployeeForm/CreateEmployeeForm";
import CreateEmployeeHeader from "../../components/Header/CreateEmployeeHeader";
import { useNavigate, useParams } from "react-router-dom";
import { useEmployee } from "../../hooks/useEmployees";
import classes from "./CreateEmployeePage.module.scss";
import { useDepartments } from "../../hooks/useDepartments";

const CreateEmployeePage = () => {
  const { id } = useParams<{ id: string }>();
  const employeeId = id ? Number(id) : undefined;
  const isEditMode = employeeId !== undefined;
  const {
    data: employee,
    isLoading: isEmployeeLoading,
    isError: isEmployeeError,
  } = useEmployee(employeeId!);
  const {
    data: departments,
    isLoading: isDepartmentsLoading,
    isError: isDepartmentsError,
  } = useDepartments();
  const navigate = useNavigate();

  const renderBody = () => {
    if (isDepartmentsLoading || (isEditMode && isEmployeeLoading)) {
      return <p className={classes.loadingMessage}>Loading...</p>;
    }
    if (isEditMode && isEmployeeError) {
      return <p className={classes.loadingMessage}>Could not load employee.</p>;
    }
    if (isDepartmentsError || !departments) {
      return (
        <p className={classes.loadingMessage}>Could not load departments.</p>
      );
    }

    return (
      <CreateEmployeeForm
        mode={isEditMode ? "edit" : "create"}
        employeeId={employeeId}
        initialData={isEditMode ? employee : undefined}
        departments={departments}
      />
    );
  };

  return (
    <main>
      <CreateEmployeeHeader
        title="Register Form"
        onBack={() => navigate(-1)}
      />

      {renderBody()}
    </main>
  );
};

export default CreateEmployeePage;
