import type { Ref } from "react";
import classes from "./Pagination.module.scss";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  containerRef?: Ref<HTMLDivElement>;
}

export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  containerRef,
}: PaginationProps) {
  const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 1;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const page = Math.min(Math.max(currentPage, 1), totalPages);

  const handlePrevious = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  return (
    <div className={classes.container} ref={containerRef}>
      <button
        className={classes.btn}
        disabled={page <= 1}
        onClick={handlePrevious}
      >
        Previous
      </button>
      <span className={classes.pageText}>
        Page {page} of {totalPages}
      </span>
      <button
        className={classes.btn}
        disabled={page >= totalPages}
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
}
