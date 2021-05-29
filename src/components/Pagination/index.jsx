import React, { useCallback } from "react";
import PT from "prop-types";
import cn from "classnames";
import IconArrowLeft from "components/Icons/ArrowLeft";
import IconArrowRight from "components/Icons/ArrowRight";
import SelectField from "components/SelectField";
import styles from "./styles.module.scss";
import Button from "components/Button";

/**
 * Displays pagination with menu to choose page size.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name added to root element
 * @param {string} [props.pageSizeClassName] class name for page size select
 * @param {string} props.id id for input element
 * @param {string} [props.label] label displayed to the left of page size dropdown
 * @param {string} [props.pageSizeLabel] label displayed at the top of page size dropdown
 * @param {(v: number) => void} props.onPageNumberClick function called when page button is clicked
 * @param {() => void} props.onPageSizeChange function called when page size is changed
 * @param {Object} props.pageSizeOptions page size options object
 * @param {Object} props.pagination pagination object
 * @returns {JSX.Element}
 */
const Pagination = ({
  className,
  pageSizeClassName,
  id,
  label,
  pageSizeLabel,
  onPageNumberClick,
  onPageSizeChange,
  pageSizeOptions,
  pagination,
}) => {
  const { pageCount, pageNumber, pageSize } = pagination;

  const onPageButtonClick = useCallback(
    (event) => {
      onPageNumberClick(+event.currentTarget.dataset.value);
    },
    [onPageNumberClick]
  );

  const pageButtons = [];
  let pageEnd = Math.min(pageNumber + 2, pageCount);
  let pageStart = Math.max(pageEnd - 2, 1);
  if (pageStart > 1) {
    pageButtons.push(
      <Button
        key={pageStart - 1}
        className={styles.buttonPrev}
        onClick={onPageButtonClick}
        size="small"
        value={pageNumber - 1}
      >
        <IconArrowLeft className={styles.iconArrowLeft} />
        <span className={styles.buttonLabel}>Previous</span>
      </Button>
    );
  }
  for (let n = pageStart; n <= pageEnd; n++) {
    pageButtons.push(
      <Button
        key={n}
        className={styles.pageButton}
        isSelected={n === pageNumber}
        onClick={onPageButtonClick}
        size="small"
        style="circle"
        value={n}
      >
        {n}
      </Button>
    );
  }
  if (pageEnd < pageCount) {
    pageButtons.push(
      <Button
        key={pageEnd + 1}
        className={styles.buttonNext}
        onClick={onPageButtonClick}
        size="small"
        value={pageNumber + 1}
      >
        <span className={styles.buttonLabel}>Next</span>
        <IconArrowRight className={styles.iconArrowRight} />
      </Button>
    );
  }
  return (
    <div className={cn(styles.pagination, className)}>
      {label && <span className={styles.label}>{label}</span>}
      <SelectField
        id={id}
        label={pageSizeLabel}
        className={cn(styles.pageSize, pageSizeClassName)}
        onChange={onPageSizeChange}
        options={pageSizeOptions}
        size="small"
        value={pageSize}
      />
      <div className={styles.pageButtons}>{pageButtons}</div>
    </div>
  );
};

Pagination.propTypes = {
  className: PT.string,
  onPageNumberClick: PT.func.isRequired,
  onPageSizeChange: PT.func.isRequired,
  options: PT.arrayOf(
    PT.shape({
      value: PT.oneOfType([PT.number, PT.string]).isRequired,
      label: PT.string.isRequired,
    })
  ),
  pagination: PT.shape({
    pageCount: PT.number.isRequired,
    pageNumber: PT.number.isRequired,
    pageSize: PT.number.isRequired,
  }),
};

export default Pagination;
