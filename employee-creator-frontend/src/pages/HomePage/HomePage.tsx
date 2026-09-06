import Button from "../../components/Button/Button";
import EmployeeList from "../../components/EmployeeList/EmployeeList";
import {
  useCreateEmployee,
  useDeleteEmployee,
  useEmployees,
} from "../../hooks/useEmployees";
import { useNavigate } from "react-router";

const HomePage = () => {
  const { data: employees, isLoading, isError, error } = useEmployees();
  const createEmployeeMutation = useCreateEmployee();
  const deleteEmployeeMutation = useDeleteEmployee();
  const navigate = useNavigate();

  const handleCreateTestEmployee = () => {
    createEmployeeMutation.mutate({
      firstName: "Jane",
      lastName: "Doe",
      middleName: "Marie",
      email: "jane.doe@example.com",
      phoneNumber: "0412345678",
      address: "123 Example Street, Melbourne VIC 3000",
      contractType: "PERMANENT",
      startDate: "2024-01-15",
      finishDate: null,
      onGoing: true,
      fullTimeOrPartTime: "FULL_TIME",
      hoursPerWeek: 38,
    });
  };

  const handleDelete = (id: number) => {
    console.log("Deleting employee with id", id);
    deleteEmployeeMutation.mutate(id);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Error: {error.message}</p>;
  }
  return (
    <main>
      <div>
        <button onClick={handleCreateTestEmployee}>Create Test Employee</button>
        {createEmployeeMutation.isPending && <p>Creating...</p>}
        {createEmployeeMutation.isError && (
          <p>Error: {createEmployeeMutation.error.message}</p>
        )}
        {createEmployeeMutation.isSuccess && <p>Employee created!</p>}
      </div>
      <EmployeeList employees={employees!} onDelete={handleDelete} />
      <Button onClick={() => navigate("/createEmployee")}>
        Add New Employee
      </Button>
    </main>
  );
};

export default HomePage;
