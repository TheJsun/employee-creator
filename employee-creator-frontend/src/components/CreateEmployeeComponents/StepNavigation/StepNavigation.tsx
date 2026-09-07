import Button from "../../Button/Button";

interface StepNavigationProps {
  currentStep: 1 | 2;
  onNext: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function StepNavigation({
  currentStep,
  onNext,
  onBack,
  isSubmitting,
}: StepNavigationProps) {
  return (
    <div>
      {currentStep === 2 && (
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
      )}

      {currentStep === 1 && (
        <Button type="button" variant="secondary" onClick={onNext}>
          Next
        </Button>
      )}

      {currentStep === 2 && (
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Employee"}
        </Button>
      )}
    </div>
  );
}
