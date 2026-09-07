import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import CreateEmployeeForm from "../../components/CreateEmployeeComponents/CreateEmployeeForm/CreateEmployeeForm";

const CreateEmployeePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Button onClick={() => navigate("/")}>Back</Button>
      <CreateEmployeeForm />
    </>
  );
};

export default CreateEmployeePage;
