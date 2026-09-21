import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import classes from "./Header.module.scss";

interface HeaderProps {
  title: string;
  button?: React.ReactNode;
  action?: React.ReactNode;
  onBack?: () => void;
}

export default function Header({ title, button, action, onBack }: HeaderProps) {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate("/"));

  return (
    <header className={classes.header}>
      <div className={classes.headerContent}>
        {button ? (
          <div className={classes.row}>
            <Button
              variant="accent"
              className={classes.header__btn}
              onClick={handleBack}
            >
              {button}
            </Button>
            <h1 className={classes.header__title}>{title}</h1>
          </div>
        ) : (
          <div className={classes.stack}>
            <h1 className={classes.header__title}>{title}</h1>
            {action && <div className={classes.header__action}>{action}</div>}
          </div>
        )}
      </div>
    </header>
  );
}
