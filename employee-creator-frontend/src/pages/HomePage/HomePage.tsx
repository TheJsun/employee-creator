import Button from "../../components/Button/Button";
import EmployeeList from "../../components/EmployeeList/EmployeeList";
import { useDeleteEmployee, useEmployees } from "../../hooks/useEmployees";
import { useNavigate } from "react-router";
import classes from "./HomePage.module.scss";
import Header from "../../components/Header/Header";

const HomePage = () => {
  const { data: employees, isLoading, isError, error } = useEmployees();
  const deleteEmployeeMutation = useDeleteEmployee();
  const navigate = useNavigate();

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
    <main className={classes.homepage}>
      <Header title="Employees' list" />
      <section className={classes.content}>
        <div className={classes.addEmployeeCard}>
          <p>Please click on 'Edit' to find more details of each employee.</p>
          <Button onClick={() => navigate("/createEmployee")}>
            Add Employee
          </Button>
        </div>

        <EmployeeList employees={employees!} onDelete={handleDelete} />
      </section>
    </main>
  );
};

export default HomePage;
