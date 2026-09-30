import classes from "./DetailsSection.module.scss";

interface DetailsSectionProps {
  title: string;
  fields: { label: string; value: React.ReactNode }[];
}

export function DetailsSection({ title, fields }: DetailsSectionProps) {
  return (
    <article className={classes.detailsSection}>
      <h2 className={classes.detailsSection__header}>{title}</h2>
      <div className={classes.details}>
        {fields.map(({ label, value }) => (
          <div className={classes.detailsField} key={label}>
            <p className={classes.detailsField__label}>{label}</p>
            <p className={classes.detailsField__data}>{value}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
