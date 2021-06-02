import React from "react";
import get from "lodash/get";
import PT from "prop-types";
import cn from "classnames";
import styles from "./styles.module.scss";

/**
 * Displays "Loading..." message or an error.
 *
 * @param {Object} props component properties
 * @param {Object} [props.error] error object
 * @returns {JSX.Element}
 */
const LoadingIndicator = ({ error }) => (
  <div className={cn(styles.loadingIndicator, { [styles.error]: !!error })}>
    <div className={styles.contents}>
      {!error
        ? "Loading..."
        : get(error, "response.data.message", error.toString())}
    </div>
  </div>
);

LoadingIndicator.propTypes = {
  error: PT.object,
};

export default LoadingIndicator;
