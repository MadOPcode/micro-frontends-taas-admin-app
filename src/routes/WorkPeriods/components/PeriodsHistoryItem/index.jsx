import React, { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import PT from "prop-types";
import cn from "classnames";
import debounce from "lodash/debounce";
import IntegerField from "components/IntegerField";
import PaymentStatus from "../PaymentStatus";
import { PAYMENT_STATUS } from "constants/workPeriods";
import { setDetailsWorkingDays } from "store/actions/workPeriods";
import { updateWorkPeriodWorkingDays } from "store/thunks/workPeriods";
import { useUpdateEffect } from "utils/hooks";
import {
  formatDateLabel,
  formatDateRange,
  formatWeeklyRate,
} from "utils/formatters";
import styles from "./styles.module.scss";
import PeriodsHistoryWeeklyRate from "../PeriodsHistoryWeeklyRate";
import moment from "moment";

/**
 * Displays working period row in history table in details view.
 *
 * @param {Object} props component properties
 * @returns {JSX.Element}
 */
const PeriodsHistoryItem = ({ isDisabled, item, data, currentStartDate }) => {
  const dispatch = useDispatch();

  const dateLabel = formatDateLabel(item.startDate, currentStartDate);
  const daysWorked = data.daysWorked;
  const isCurrent = moment(item.startDate).isSame(currentStartDate, "date");

  const onWorkingDaysChange = useCallback(
    (daysWorked) => {
      dispatch(setDetailsWorkingDays(item.id, daysWorked));
    },
    [dispatch, item.id]
  );

  const updateWorkingDays = useCallback(
    debounce(
      (daysWorked) => {
        dispatch(updateWorkPeriodWorkingDays(item.id, daysWorked));
      },
      300,
      { leading: false }
    ),
    [dispatch, item.id]
  );

  // Update working days on server if working days change.
  useUpdateEffect(() => {
    if (!isCurrent) {
      updateWorkingDays(data.daysWorked);
    }
  }, [data.daysWorked, isCurrent]);

  return (
    <tr
      className={cn(styles.container, {
        [styles.current]: dateLabel === "Current Period",
      })}
    >
      <td className={styles.dateRange}>
        {formatDateRange(item.startDate, item.endDate)}
      </td>
      <td className={styles.dateLabel}>{dateLabel}</td>
      <td className={styles.weeklyRate}>
        <PeriodsHistoryWeeklyRate
          className={styles.weeklyRateContainer}
          payments={item.payments}
          weeklyRate={formatWeeklyRate(item.weeklyRate)}
        />
      </td>
      <td className={styles.paymentStatus}>
        <PaymentStatus status={item.paymentStatus} />
      </td>
      <td className={styles.daysWorked}>
        {item.paymentStatus === PAYMENT_STATUS.PAID ? (
          `${daysWorked} ${daysWorked === 1 ? "Day" : "Days"}`
        ) : (
          <IntegerField
            className={styles.daysWorkedControl}
            name={`wp_det_wd_${item.id}`}
            isDisabled={isDisabled}
            onChange={onWorkingDaysChange}
            value={daysWorked}
            maxValue={5}
            minValue={data.daysPaid}
          />
        )}
      </td>
    </tr>
  );
};

PeriodsHistoryItem.propTypes = {
  isDisabled: PT.bool.isRequired,
  item: PT.shape({
    id: PT.string.isRequired,
    startDate: PT.oneOfType([PT.string, PT.number]).isRequired,
    endDate: PT.oneOfType([PT.string, PT.number]).isRequired,
    paymentStatus: PT.string.isRequired,
    payments: PT.array,
    weeklyRate: PT.number,
  }).isRequired,
  data: PT.shape({
    daysWorked: PT.number.isRequired,
    daysPaid: PT.number.isRequired,
  }).isRequired,
  currentStartDate: PT.oneOfType([PT.string, PT.number, PT.object]).isRequired,
};

export default memo(PeriodsHistoryItem);
