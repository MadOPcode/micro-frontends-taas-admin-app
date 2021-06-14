import React from "react";
import PT from "prop-types";
import ToastMessage from "components/ToastrMessage";

/**
 * Displays a toastr message with info about the number of resources payments
 * for which have been failed to be scheduled.
 *
 * @param {Object} props
 * @returns {JSX.Element}
 */
const ToastPaymentsError = ({ periods, remove }) => {
  return (
    <ToastMessage type="error" remove={remove}>
      Failed to schedule payments for {periods.length} resources
    </ToastMessage>
  );
};

ToastPaymentsError.propTypes = {
  periods: PT.arrayOf(
    PT.shape({
      workPeriodId: PT.string.isRequired,
      amount: PT.number.isRequired,
    })
  ),
  remove: PT.func,
};

export default ToastPaymentsError;
