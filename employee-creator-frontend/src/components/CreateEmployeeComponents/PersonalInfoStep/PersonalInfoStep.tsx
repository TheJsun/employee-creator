import { useFormContext } from "react-hook-form";
import type { CreateEmployeeRequest } from "../../../schemas/employee-schema";

export default function PersonalInfoStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateEmployeeRequest>();
  return (
    <section>
      <h3>Personal Information</h3>

      <label htmlFor="firstName">First name</label>
      <input id="firstName" {...register("firstName")} />
      {errors.firstName && <p>{errors.firstName.message}</p>}

      <label htmlFor="middleName">Middle name (if applicable)</label>
      <input id="middleName" {...register("middleName")} />
      {errors.middleName && <p>{errors.middleName.message}</p>}

      <label htmlFor="lastName">Last name</label>
      <input id="lastName" {...register("lastName")} />
      {errors.lastName && <p>{errors.lastName.message}</p>}

      <h3>Contact Details</h3>
      <label htmlFor="email">Email address</label>
      <input id="email" type="email" {...register("email")} />
      {errors.email && <p>{errors.email.message}</p>}

      <label htmlFor="phoneNumber">Mobile number</label>
      <input id="phoneNumber" {...register("phoneNumber")} />
      {errors.phoneNumber && <p>{errors.phoneNumber.message}</p>}

      <label htmlFor="address">Residential address</label>
      <input id="address" {...register("address")} />
      {errors.address && <p>{errors.address.message}</p>}
    </section>
  );
}
