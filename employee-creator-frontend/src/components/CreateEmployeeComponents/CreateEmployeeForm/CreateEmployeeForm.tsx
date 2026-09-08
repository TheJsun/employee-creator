import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { CreateEmployeeRequest } from "../../../schemas/employee-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateEmployee } from "../../../hooks/useEmployees";
import PersonalInfoStep from "../PersonalInfoStep/PersonalInfoStep";
import EmploymentDetailsStep from "../EmploymentDetailsStep/EmploymentDetailsStep";
import StepNavigation from "../StepNavigation/StepNavigation";
import { useNavigate } from "react-router-dom";
import classes from "./CreateEmployeeForm.module.scss";
import Button from "../../Button/Button";

export default function CreateEmployeeForm() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const methods = useForm<CreateEmployeeRequest>({
    resolver: zodResolver(CreateEmployeeRequest),
    mode: "onBlur",
  });
  const createEmployeeMutation = useCreateEmployee();
  const navigate = useNavigate();

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

  const handleCancel = () => {
    navigate("/");
  };

  const onSubmit = (data: CreateEmployeeRequest) => {
    createEmployeeMutation.mutate(data);
    navigate("/");
  };

  return (
    <FormProvider {...methods}>
      <form
        className={classes.employeeForm}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        {currentStep === 1 && <PersonalInfoStep />}
        {currentStep === 2 && <EmploymentDetailsStep />}
        <div className={classes.formButtons}>
          {currentStep === 2 && (
            <div>
              <Button
                type="submit"
                variant="primary"
                disabled={createEmployeeMutation.isPending}
              >
                {createEmployeeMutation.isPending ? "Creating..." : "Save"}
              </Button>
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </div>
        <StepNavigation
          currentStep={currentStep}
          onNext={handleNext}
          onBack={handleBack}
        />
      </form>
    </FormProvider>
  );
}
