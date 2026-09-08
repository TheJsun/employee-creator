import CreateEmployeeForm from "../../components/CreateEmployeeComponents/CreateEmployeeForm/CreateEmployeeForm";
import Header from "../../components/Header/Header";

const CreateEmployeePage = () => {
  return (
    <main>
      <Header title="Employee details" button="Back" />

      <CreateEmployeeForm />
    </main>
  );
};

export default CreateEmployeePage;
