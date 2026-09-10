import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import classes from "./Header.module.scss";

interface HeaderProps {
  title: string;
  button?: React.ReactNode;
  action?: React.ReactNode;
}

export default function Header({ title, button, action }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={classes.header}>
      <div className={classes.headerContent}>
        {button ? (
          <div className={classes.row}>
            <Button
              variant="accent"
              className={classes.header__btn}
              onClick={() => navigate("/")}
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
