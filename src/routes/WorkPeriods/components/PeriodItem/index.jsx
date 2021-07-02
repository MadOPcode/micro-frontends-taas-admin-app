import React, { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import PT from "prop-types";
import cn from "classnames";
import debounce from "lodash/debounce";
import Checkbox from "components/Checkbox";
import ProjectName from "components/ProjectName";
import PaymentError from "../PaymentError";
import PaymentStatus from "../PaymentStatus";
import PaymentTotal from "../PaymentTotal";
import PeriodDetails from "../PeriodDetails";
import { PAYMENT_STATUS } from "constants/workPeriods";
import {
  setWorkPeriodWorkingDays,
  toggleWorkingDaysUpdated,
  toggleWorkPeriod,
} from "store/actions/workPeriods";
import {
  toggleWorkPeriodDetails,
  updateWorkPeriodWorkingDays,
} from "store/thunks/workPeriods";
import { useUpdateEffect } from "utils/hooks";
import { formatUserHandleLink, formatWeeklyRate } from "utils/formatters";
import { stopPropagation } from "utils/misc";
import styles from "./styles.module.scss";
import PeriodWorkingDays from "../PeriodWorkingDays";

/**
 * Displays the working period data row to be used in PeriodList component.
 *
 * @param {Object} props component properties
 * @param {boolean} [props.isDisabled] whether the item is disabled
 * @param {boolean} [props.isFailed] whether the item should be highlighted as failed
 * @param {boolean} props.isSelected whether the item is selected
 * @param {Object} props.item object describing a working period
 * @param {Object} props.data changeable working period data such as working days
 * @param {Object} [props.details] object with working period details
 * @returns {JSX.Element}
 */
const PeriodItem = ({
  isDisabled = false,
  isFailed = false,
  isSelected,
  item,
  data,
  details,
}) => {
  const dispatch = useDispatch();

  const onToggleItem = useCallback(
    (event) => {
      dispatch(toggleWorkPeriod(event.target.value));
    },
    [dispatch]
  );

  const onToggleItemDetails = useCallback(() => {
    dispatch(toggleWorkPeriodDetails(item));
  }, [dispatch, item]);

  const onWorkingDaysUpdateHintTimeout = useCallback(() => {
    dispatch(toggleWorkingDaysUpdated(item.id, false));
  }, [dispatch, item.id]);

  const onWorkingDaysChange = useCallback(
    (daysWorked) => {
      dispatch(setWorkPeriodWorkingDays(item.id, daysWorked));
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
    updateWorkingDays(data.daysWorked);
  }, [data.daysWorked]);

  return (
    <>
      <tr
        className={cn(styles.container, {
          [styles.hasDetails]: !!details,
          [styles.isFailed]: isFailed,
        })}
        onClick={onToggleItemDetails}
      >
        <td className={styles.toggle}>
          <Checkbox
            size="small"
            isDisabled={isDisabled}
            checked={isSelected}
            name={`wp_chb_${item.id}`}
            onChange={onToggleItem}
            option={{ value: item.id }}
            stopClickPropagation={true}
          />
        </td>
        <td className={styles.userHandle}>
          <span>
            <a
              href={formatUserHandleLink(item.projectId, item.rbId)}
              onClick={stopPropagation}
              target="_blank"
              rel="noreferrer"
            >
              {item.userHandle}
            </a>
          </span>
        </td>
        <td className={styles.teamName}>
          <ProjectName projectId={item.projectId} />
        </td>
        <td className={styles.startDate}>{item.startDate}</td>
        <td className={styles.endDate}>{item.endDate}</td>
        <td className={styles.weeklyRate}>
          <span>{formatWeeklyRate(item.weeklyRate)}</span>
        </td>
        <td className={styles.paymentTotal}>
          {data.paymentErrorLast && (
            <PaymentError
              className={styles.paymentError}
              errorDetails={data.paymentErrorLast}
              isImportant={data.paymentStatus !== PAYMENT_STATUS.COMPLETED}
              popupStrategy="fixed"
            />
          )}
          <PaymentTotal
            className={styles.paymentTotalContainer}
            daysPaid={data.daysPaid}
            payments={data.payments}
            paymentTotal={data.paymentTotal}
            popupStrategy="fixed"
          />
        </td>
        <td>
          <PaymentStatus status={data.paymentStatus} />
        </td>
        <td className={styles.daysWorked}>
          <PeriodWorkingDays
            updateHintTimeout={2000}
            controlName={`wp_wrk_days_${item.id}`}
            data={data}
            isDisabled={isDisabled}
            onWorkingDaysChange={onWorkingDaysChange}
            onWorkingDaysUpdateHintTimeout={onWorkingDaysUpdateHintTimeout}
          />
        </td>
      </tr>
      {details && (
        <PeriodDetails
          className={styles.periodDetails}
          details={details}
          isDisabled={isDisabled}
          isFailed={isFailed}
        />
      )}
    </>
  );
};

PeriodItem.propTypes = {
  className: PT.string,
  isDisabled: PT.bool,
  isFailed: PT.bool,
  isSelected: PT.bool.isRequired,
  item: PT.shape({
    id: PT.oneOfType([PT.number, PT.string]).isRequired,
    rbId: PT.string.isRequired,
    projectId: PT.oneOfType([PT.number, PT.string]).isRequired,
    userHandle: PT.string.isRequired,
    teamName: PT.oneOfType([PT.number, PT.string]).isRequired,
    startDate: PT.string.isRequired,
    endDate: PT.string.isRequired,
    weeklyRate: PT.number,
  }).isRequired,
  data: PT.shape({
    daysWorked: PT.number.isRequired,
    daysPaid: PT.number.isRequired,
    paymentErrorLast: PT.object,
    payments: PT.array,
    paymentStatus: PT.string.isRequired,
    paymentTotal: PT.number.isRequired,
  }).isRequired,
  details: PT.shape({
    periodId: PT.string.isRequired,
    rbId: PT.string.isRequired,
    jobName: PT.string.isRequired,
    jobNameIsLoading: PT.bool.isRequired,
    billingAccountId: PT.number.isRequired,
    billingAccounts: PT.arrayOf(
      PT.shape({
        label: PT.string.isRequired,
        value: PT.number.isRequired,
      })
    ).isRequired,
    billingAccountsIsLoading: PT.bool.isRequired,
    periods: PT.array.isRequired,
    periodsIsLoading: PT.bool.isRequired,
  }),
};

export default memo(PeriodItem);
