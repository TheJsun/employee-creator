import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import classes from "./Header.module.scss";

interface HeaderProps {
  title: string;
  button?: React.ReactNode;
}

export default function Header({ title, button }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={classes.header}>
      <div className={classes.headerContent}>
        <div className={classes.header__btn}>
          {button && <Button onClick={() => navigate("/")}>{button} </Button>}
        </div>

        <h1 className={classes.header__title}>{title}</h1>
      </div>
    </header>
  );
}
