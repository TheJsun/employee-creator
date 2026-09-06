import "./App.css";
import { useCreateEmployee, useEmployees } from "./hooks/useEmployees";

function App() {
  const { data: employees, isLoading, isError, error } = useEmployees();
  const createEmployeeMutation = useCreateEmployee();

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

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <main>
      <h1>hello</h1>
      <div>
        <button onClick={handleCreateTestEmployee}>Create Test Employee</button>
        {createEmployeeMutation.isPending && <p>Creating...</p>}
        {createEmployeeMutation.isError && (
          <p>Error: {createEmployeeMutation.error.message}</p>
        )}
        {createEmployeeMutation.isSuccess && <p>Employee created!</p>}
      </div>
      <ul>
        {employees?.map((emp) => (
          <li>
            <p key={emp.id}>{emp.firstName}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
