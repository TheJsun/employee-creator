import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import CreateEmployeePage from "./pages/CreateEmployeePage/CreateEmployeePage";
import { EmployeeDetailsPage } from "./pages/EmployeeDetailsPage/EmployeeDetailsPage";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { RequireAuth } from "./components/RequireAuth/RequireAuth";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<RequireAuth />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/employees/new" element={<CreateEmployeePage />} />
            <Route path="/employees/edit/:id" element={<CreateEmployeePage />} />
            <Route path="/employees/:id" element={<EmployeeDetailsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
