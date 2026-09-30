import classes from "./HomeHeader.module.scss";

interface HomeHeaderProps {
  title: string;
  action?: React.ReactNode;
  numEmployees: number;
}

export default function HomeHeader({
  title,
  action,
  numEmployees,
}: HomeHeaderProps) {
  return (
    <header className={classes.header}>
      <div className={classes.left}>
        <h1 className={classes.header__title}>{title}</h1>
        <p className={classes.employeeCount}>{numEmployees} employees</p>
      </div>
      <div className={classes.action}>{action}</div>
    </header>
  );
}
