import { useFormContext } from "react-hook-form";
import type { CreateEmployeeRequest } from "../../../schemas/employee-schema";
import classes from "./PersonalInfoStep.module.scss";

export default function PersonalInfoStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateEmployeeRequest>();
  return (
    <section className={classes.employeeDetails}>
      <article className={classes.employeeDetails__personalInfo}>
        <h3>Personal Information</h3>

        <label className={classes.label} htmlFor="firstName">
          First name
        </label>
        <input
          className={classes.field}
          id="firstName"
          {...register("firstName")}
        />
        {errors.firstName && (
          <p className={classes.error}>{errors.firstName.message}</p>
        )}

        <label className={classes.label} htmlFor="middleName">
          Middle name (if applicable)
        </label>
        <input
          className={classes.field}
          id="middleName"
          {...register("middleName")}
        />
        {errors.middleName && (
          <p className={classes.error}>{errors.middleName.message}</p>
        )}

        <label className={classes.label} htmlFor="lastName">
          Last name
        </label>
        <input
          className={classes.field}
          id="lastName"
          {...register("lastName")}
        />
        {errors.lastName && (
          <p className={classes.error}>{errors.lastName.message}</p>
        )}
      </article>
      <article className={classes.employeeDetails__contactInfo}>
        <h3>Contact Details</h3>
        <label className={classes.label} htmlFor="email">
          Email address
        </label>
        <input
          className={`${classes["field"]} ${classes[`field--long`]}`}
          id="email"
          type="email"
          {...register("email")}
        />
        {errors.email && (
          <p className={classes.error}>{errors.email.message}</p>
        )}

        <label className={classes.label} htmlFor="phoneNumber">
          Mobile number
        </label>
        <input
          className={classes.field}
          id="phoneNumber"
          {...register("phoneNumber")}
        />
        {errors.phoneNumber && (
          <p className={classes.error}>{errors.phoneNumber.message}</p>
        )}

        <label className={classes.label} htmlFor="address">
          Residential address
        </label>
        <input
          className={`${classes["field"]} ${classes[`field--long`]}`}
          id="address"
          {...register("address")}
        />
        {errors.address && (
          <p className={classes.error}>{errors.address.message}</p>
        )}
      </article>
    </section>
  );
}
