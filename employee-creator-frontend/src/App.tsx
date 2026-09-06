import "./App.css";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    fetch("http://localhost:8080/api/employees")
      .then((res) => {
        console.log("Status:", res.status);
        return res.json();
      })
      .then((data) => console.log("Data:", data))
      .catch((err) => console.error("Fetch failed:", err));
  }, []);
  return (
    <>
      <h1>hello</h1>
    </>
  );
}

export default App;
