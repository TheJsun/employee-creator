import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import HomePage from "./pages/HomePage/HomePage";
import CreateEmployeePage from "./pages/CreateEmployeePage/CreateEmployeePage";

function App() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/employees/new" element={<CreateEmployeePage />} />
          <Route path="/employees/edit/:id" element={<CreateEmployeePage />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
