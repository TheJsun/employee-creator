import { useNavigate } from "react-router-dom";
import Button from "../../Button/Button";
import classes from "./StepNavigation.module.scss";

interface StepNavigationProps {
  currentStep: 1 | 2;
  onNext: () => void;
  onBack: () => void;
  mode: "create" | "edit";
  isPending: boolean;
}

export default function StepNavigation({
  currentStep,
  onNext,
  onBack,
  mode,
  isPending,
}: StepNavigationProps) {
  const navigate = useNavigate();
  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className={classes.buttons}>
      {currentStep === 1 && (
        <Button
          type="button"
          variant="primary"
          onClick={onNext}
          className={classes.nextButton}
        >
          Next
        </Button>
      )}
      {currentStep === 2 && (
        <div className={classes.formButtons}>
          <Button type="button" variant="secondary" onClick={onBack}>
            Back
          </Button>

          <div>
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isPending}>
              {mode === "edit"
                ? isPending
                  ? "Saving..."
                  : "Save Changes"
                : isPending
                  ? "Creating..."
                  : "Save"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
