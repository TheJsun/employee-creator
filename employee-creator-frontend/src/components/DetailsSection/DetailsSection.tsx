import { Skeleton } from "../Skeleton/Skeleton";
import classes from "./DetailsSection.module.scss";

interface DetailsSectionProps {
  title: string;
  fields: { label: string; value: React.ReactNode }[];
  isLoading?: boolean;
}

export function DetailsSection({
  title,
  fields,
  isLoading = false,
}: DetailsSectionProps) {
  return (
    <article className={classes.detailsSection}>
      <h2 className={classes.detailsSection__header}>{title}</h2>
      <div className={classes.details}>
        {fields.map(({ label, value }) => (
          <div className={classes.detailsField} key={label}>
            <p className={classes.detailsField__label}>{label}</p>
            <p className={classes.detailsField__data}>
              {isLoading ? <Skeleton width="10em" variant="light" /> : value}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}
