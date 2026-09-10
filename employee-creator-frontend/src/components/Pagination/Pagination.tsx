import classes from "./Pagination.module.scss";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={classes.container}>
      <button
        className={classes.btn}
        disabled={currentPage <= 1}
        onClick={handlePrevious}
      >
        Previous
      </button>
      <span className={classes.pageText}>
        Page {currentPage} of {totalPages}
      </span>
      <button
        className={classes.btn}
        disabled={currentPage >= totalPages}
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
}
