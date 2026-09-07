import { useFormContext } from "react-hook-form";
import type { CreateEmployeeRequest } from "../../../schemas/employee-schema";
import { useEffect } from "react";

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
    <section>
      <h3>Employee Status</h3>

      <label>What is contract type?</label>
      <label>
        <input type="radio" value="PERMANENT" {...register("contractType")} />
        Permanent
      </label>

      <label>
        <input type="radio" value="CONTRACT" {...register("contractType")} />
        Contract
      </label>
      {errors.contractType && <p>{errors.contractType.message}</p>}

      <label htmlFor="startDate">Start date</label>
      <input id="startDate" type="date" {...register("startDate")} />
      {errors.startDate && <p>{errors.startDate.message}</p>}

      <label htmlFor="finishDate">Finish date</label>
      <input
        id="finishDate"
        type="date"
        disabled={isOnGoing}
        {...register("finishDate")}
      />
      {errors.finishDate && <p>{errors.finishDate.message}</p>}

      <label>
        <input type="checkbox" {...register("onGoing")} />
        Ongoing
      </label>

      <label>Is this on a full-time or part-time basis?</label>
      <label>
        <input
          type="radio"
          value="FULL_TIME"
          {...register("fullTimeOrPartTime")}
        />
        Full-time
      </label>

      <label>
        <input
          type="radio"
          value="PART_TIME"
          {...register("fullTimeOrPartTime")}
        />
        Part-time
      </label>
      {errors.fullTimeOrPartTime && <p>{errors.fullTimeOrPartTime.message}</p>}

      <label htmlFor="hoursPerWeek">
        <input
          id="hoursPerWeek"
          type="number"
          {...register("hoursPerWeek", { valueAsNumber: true })}
        />
      </label>
      {errors.hoursPerWeek && <p>{errors.hoursPerWeek.message}</p>}
    </section>
  );
}
