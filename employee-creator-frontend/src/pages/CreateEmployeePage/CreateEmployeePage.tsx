import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";

const CreateEmployeePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolor magni
        soluta, veniam maiores tempore nostrum. Quae cum, iste ducimus soluta
        eius accusantium cumque expedita doloribus explicabo ex perspiciatis
        facere reiciendis.
      </p>
      <Button onClick={() => navigate("/")}>Back</Button>
    </>
  );
};

export default CreateEmployeePage;
