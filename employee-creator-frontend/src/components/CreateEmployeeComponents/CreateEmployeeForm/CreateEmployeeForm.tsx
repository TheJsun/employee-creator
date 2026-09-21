import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  CreateEmployeeRequest,
  type EmployeeResponse,
} from "../../../schemas/employee-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateEmployee,
  useUpdateEmployee,
} from "../../../hooks/useEmployees";
import PersonalInfoStep from "../PersonalInfoStep/PersonalInfoStep";
import EmploymentDetailsStep from "../EmploymentDetailsStep/EmploymentDetailsStep";
import StepNavigation from "../StepNavigation/StepNavigation";
import { useNavigate } from "react-router-dom";
import classes from "./CreateEmployeeForm.module.scss";
import { toFormData } from "../../../services/form-services";

interface CreateEmployeeProps {
  mode: "create" | "edit";
  employeeId: number | undefined;
  initialData: EmployeeResponse | undefined;
}

export default function CreateEmployeeForm({
  mode,
  employeeId,
  initialData,
}: CreateEmployeeProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const methods = useForm<CreateEmployeeRequest>({
    resolver: zodResolver(CreateEmployeeRequest),
    defaultValues: initialData ? toFormData(initialData) : undefined,
    mode: "onBlur",
  });
  const createEmployeeMutation = useCreateEmployee();
  const updateEmployeeMutation = useUpdateEmployee();
  const navigate = useNavigate();
  const activeMutation =
    mode === "edit" ? updateEmployeeMutation : createEmployeeMutation;

  const handleNext = async () => {
    const isValid = await methods.trigger([
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "address",
    ]);
    if (isValid) setCurrentStep(2);
  };

  const handleBack = () => setCurrentStep(1);

  const onSubmit = (data: CreateEmployeeRequest) => {
    if (mode === "edit" && employeeId) {
      updateEmployeeMutation.mutate(
        { id: employeeId, data },
        { onSuccess: () => navigate(-1) },
      );
    } else {
      createEmployeeMutation.mutate(data, {
        onSuccess: () => navigate("/"),
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className={classes.formContainer}
        onSubmit={methods.handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <div className={classes.formCard}>
          {currentStep === 1 && <PersonalInfoStep />}
          {currentStep === 2 && <EmploymentDetailsStep />}

          <StepNavigation
            currentStep={currentStep}
            onNext={handleNext}
            onBack={handleBack}
            mode={mode}
          />
          {activeMutation.isError && (
            <p className={classes.error}>{activeMutation.error.message}</p>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
