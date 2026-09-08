import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import HomePage from "./pages/HomePage/HomePage";
import CreateEmployeePage from "./pages/CreateEmployeePage/CreateEmployeePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/createEmployee" element={<CreateEmployeePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
