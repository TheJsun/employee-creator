import classes from "./Skeleton.module.scss";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: "light" | "dark";
  circle?: boolean;
  className?: string;
}

export function Skeleton({
  width,
  height,
  variant = "dark",
  circle = false,
  className,
}: SkeletonProps) {
  return (
    <span
      className={`${classes.skeleton} ${classes[variant]} ${circle ? classes.circle : ""} ${className ?? ""}`.trim()}
      style={{ width, height }}
    />
  );
}
