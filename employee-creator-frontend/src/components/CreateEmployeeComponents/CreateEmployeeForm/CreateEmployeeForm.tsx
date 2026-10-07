import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  CreateEmployeeRequest,
  type CreateEmployeeInput,
  type CreateEmployeeOutput,
  type CreateEmployeeResponse,
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
import type { DepartmentResponse } from "../../../schemas/department-schema";

interface CreateEmployeeProps {
  mode: "create" | "edit";
  employeeId: number | undefined;
  initialData: EmployeeResponse | undefined;
  departments: DepartmentResponse[];
}

export default function CreateEmployeeForm({
  mode,
  employeeId,
  initialData,
  departments,
}: CreateEmployeeProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [created, setCreated] = useState<CreateEmployeeResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const methods = useForm<CreateEmployeeInput, unknown, CreateEmployeeOutput>({
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
      // Hold the result instead of navigating away: the temporary password is
      // returned once and cannot be fetched again, so the admin has to see it.
      createEmployeeMutation.mutate(data, {
        onSuccess: (result) => setCreated(result),
      });
    }
  };

  const handleCopy = async () => {
    if (!created) return;
    try {
      await navigator.clipboard.writeText(created.temporaryPassword);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  if (created) {
    return (
      <div className={classes.formContainer}>
        <div className={classes.formCard}>
          <h2 className={classes.successTitle}>Employee created</h2>
          <p className={classes.successBody}>
            {created.employee.firstName} {created.employee.lastName} can now
            sign in with the credentials below. The temporary password is shown
            only once. Copy it now and pass it on.
          </p>

          <dl className={classes.credentials}>
            <dt className={classes.credentialLabel}>Email</dt>
            <dd className={classes.credentialValue}>
              {created.employee.email}
            </dd>

            <dt className={classes.credentialLabel}>Temporary password</dt>
            <dd className={classes.credentialValue}>
              <code className={classes.password}>
                {created.temporaryPassword}
              </code>
              <button
                type="button"
                className={classes.copyButton}
                onClick={handleCopy}
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </dd>
          </dl>

          <p aria-live="polite" className={classes.visuallyHidden}>
            {copied ? "Temporary password copied to clipboard" : ""}
          </p>

          <button
            type="button"
            className={classes.doneButton}
            onClick={() => navigate("/")}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        className={classes.formContainer}
        onSubmit={methods.handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <div className={classes.formCard}>
          {currentStep === 1 && <PersonalInfoStep />}
          {currentStep === 2 && (
            <EmploymentDetailsStep departments={departments} />
          )}

          <StepNavigation
            currentStep={currentStep}
            onNext={handleNext}
            onBack={handleBack}
            mode={mode}
            isPending={activeMutation.isPending}
          />
          {activeMutation.isError && (
            <p className={classes.error}>{activeMutation.error.message}</p>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
