import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import CreateEmployeePage from "./pages/CreateEmployeePage/CreateEmployeePage";
import { EmployeeDetailsPage } from "./pages/EmployeeDetailsPage/EmployeeDetailsPage";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/employees/new" element={<CreateEmployeePage />} />
          <Route path="/employees/edit/:id" element={<CreateEmployeePage />} />
          <Route path="/employees/:id" element={<EmployeeDetailsPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
