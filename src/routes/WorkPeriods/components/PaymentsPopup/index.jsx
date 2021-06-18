import React from "react";
import PT from "prop-types";
import cn from "classnames";
import styles from "./styles.module.scss";
import PaymentsListItem from "../PaymentsListItem";

/**
 * Displays popup with payments.
 *
 * @param {Object} props component properties
 * @returns {JSX.Element}
 */
const PaymentsPopup = ({ className, payments }) => {
  return (
    <form className={cn(styles.container, className)} action="#">
      {/* <div className={styles.title}>Challenges for Payments</div> */}
      <table className={styles.paymentsList}>
        <thead>
          <tr>
            <th>Challenge ID</th>
            <th>Weekly Rate</th>
            <th>Days</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <PaymentsListItem key={payment.id} item={payment} />
          ))}
        </tbody>
      </table>
    </form>
  );
};

PaymentsPopup.propTypes = {
  className: PT.string,
  payments: PT.arrayOf(
    PT.shape({
      id: PT.oneOfType([PT.string, PT.number]),
      challengeId: PT.oneOfType([PT.string, PT.number]),
    })
  ),
};

export default PaymentsPopup;
