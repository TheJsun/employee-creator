import Button from "../../Button/Button";
import classes from "./StepNavigation.module.scss";

interface StepNavigationProps {
  currentStep: 1 | 2;
  onNext: () => void;
  onBack: () => void;
}

export default function StepNavigation({
  currentStep,
  onNext,
  onBack,
}: StepNavigationProps) {
  return (
    <div className={classes.buttons}>
      <div className={classes[`buttons--navigation`]}>
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
      </div>
    </div>
  );
}
