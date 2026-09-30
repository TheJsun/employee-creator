import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import classes from "./EmployeeDetailsHeader.module.scss";

interface EmployeeDetailsHeaderProps {
  title: string;
  onBack?: () => void;
}

export default function EmployeeDetailsHeader({
  title,
  onBack,
}: EmployeeDetailsHeaderProps) {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate("/"));

  return (
    <header className={classes.header}>
      <div className={classes.headerContent}>
        <div className={classes.row}>
          <Button
            variant="accent"
            className={classes.backBtn}
            onClick={handleBack}
          >
            Back
          </Button>
          <h1 className={classes.title}>{title}</h1>
        </div>
      </div>
    </header>
  );
}
