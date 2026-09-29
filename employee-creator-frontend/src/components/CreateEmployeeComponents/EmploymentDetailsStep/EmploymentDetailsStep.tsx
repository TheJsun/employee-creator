import { useFormContext } from "react-hook-form";
import type { CreateEmployeeRequest } from "../../../schemas/employee-schema";
import { useEffect } from "react";
import classes from "./EmploymentDetailsStep.module.scss";

export default function EmploymentDetailsStep() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateEmployeeRequest>();

  const isOnGoing = watch("onGoing");

  useEffect(() => {
    if (isOnGoing) {
      setValue("finishDate", null);
    }
  }, [isOnGoing, setValue]);

  return (
    <section className={classes.employeeDetails}>
      <h3>Employee Status</h3>

      <label className={classes.label} htmlFor="hoursPerWeek">
        Hours per week{" "}
      </label>
      <input
        className={`${classes.field} ${errors.hoursPerWeek ? classes["field--invalid"] : ""}`.trim()}
        id="hoursPerWeek"
        type="number"
        {...register("hoursPerWeek", { valueAsNumber: true })}
      />
      <div className={classes.optionInput}>
        <div className={classes.label}>What is contract type?</div>
        <label>
          <input type="radio" value="PERMANENT" {...register("contractType")} />
          Permanent
        </label>

        <label>
          <input type="radio" value="CONTRACT" {...register("contractType")} />
          Contract
        </label>
        {errors.contractType && (
          <p className={classes.error}>{errors.contractType.message}</p>
        )}
      </div>

      <label className={classes.label} htmlFor="startDate">
        Start date
      </label>
      <input
        className={classes["field--date"]}
        id="startDate"
        type="date"
        {...register("startDate")}
      />
      {errors.startDate && (
        <p className={classes.error}>{errors.startDate.message}</p>
      )}

      <label className={classes.label} htmlFor="finishDate">
        Finish date
      </label>
      <input
        className={classes["field--date"]}
        id="finishDate"
        type="date"
        disabled={isOnGoing}
        {...register("finishDate")}
      />
      {errors.finishDate && (
        <p className={classes.error}>{errors.finishDate.message}</p>
      )}

      <label>
        <input type="checkbox" {...register("onGoing")} />
        Ongoing
      </label>

      <div className={classes.optionInput}>
        <div className={classes.label}>
          Is this on a full-time or part-time basis?
        </div>
        <label>
          <input
            type="radio"
            value="FULL_TIME"
            {...register("employmentType")}
          />
          Full-time
        </label>

        <label>
          <input
            type="radio"
            value="PART_TIME"
            {...register("employmentType")}
          />
          Part-time
        </label>
        {errors.employmentType && (
          <p className={classes.error}>{errors.employmentType.message}</p>
        )}
      </div>

      <label className={classes.label} htmlFor="hoursPerWeek">
        Hours per week{" "}
      </label>
      <input
        className={`${classes.field} ${errors.hoursPerWeek ? classes["field--invalid"] : ""}`.trim()}
        id="hoursPerWeek"
        type="number"
        {...register("hoursPerWeek", { valueAsNumber: true })}
      />

      {errors.hoursPerWeek && (
        <p className={classes.error}>{errors.hoursPerWeek.message}</p>
      )}
    </section>
  );
}
