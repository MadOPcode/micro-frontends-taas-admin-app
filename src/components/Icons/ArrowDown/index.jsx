import React from "react";
import PT from "prop-types";
import cn from "classnames";
import IconWrapper from "components/IconWrapper";
import styles from "./styles.module.scss";

/**
 *
 * @param {Object} props component props
 * @param {string} [props.className] class name added to root element
 * @returns {JSX.Element}
 */
const ArrowDown = ({ className }) => (
  <IconWrapper className={cn(styles.arrow, className)}>{jsx}</IconWrapper>
);

ArrowDown.propTypes = {
  className: PT.string,
};

export default ArrowDown;

// This JSX will never change so it's alright to create it only once.
const jsx = (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 15 9"
    enableBackground="new 0 0 15 9"
    xmlSpace="preserve"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#137D60"
      d="M6.7914,8.2883L0.7067,2.1772
	C0.312,1.7808,0.3011,1.1434,0.6818,0.7337C1.044,0.3439,1.6537,0.3216,2.0434,0.6838c0.0091,0.0085,0.0181,0.0171,0.0269,0.026
	L7.5,6.163l0,0l5.4297-5.4533c0.3754-0.3771,0.9855-0.3784,1.3625-0.003c0.0088,0.0088,0.0175,0.0178,0.026,0.0269
	c0.3808,0.4097,0.3698,1.0471-0.0249,1.4435L8.2086,8.2883C7.819,8.6797,7.1858,8.681,6.7944,8.2913
	C6.7934,8.2903,6.7924,8.2893,6.7914,8.2883z"
    />
  </svg>
);
