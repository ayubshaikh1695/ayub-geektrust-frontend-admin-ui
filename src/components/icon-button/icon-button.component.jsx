import { memo } from "react";
import PropTypes from "prop-types";
import { Typography } from "components";
import styles from "./icon-button.module.css";

// supported variants
const VARIANTS = { primary: "primary", secondary: "secondary" };

const IconButton = (props) => {
  const {
    label,
    variant,
    cssClass,
    faIconClass,
    outlined,
    selected,
    disabled,
    onClick,
  } = props;

  let buttonClass = styles.buttonBase;

  if (VARIANTS[variant]) {
    buttonClass += ` ${styles[variant]}`;
  }

  if (outlined === true) {
    buttonClass += ` ${styles.outlined}`;
  }

  if (selected === true) {
    buttonClass += ` ${styles.selected}`;
  }

  if (cssClass) {
    buttonClass += ` ${cssClass}`;
  }

  return (
    <button className={buttonClass} disabled={disabled} onClick={onClick}>
      {faIconClass ? (
        <i className={faIconClass} />
      ) : (
        <Typography variant="button-text">{label}</Typography>
      )}
    </button>
  );
};

IconButton.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  variant: PropTypes.string,
  cssClass: PropTypes.string,
  faIconClass: PropTypes.string,
  outlined: PropTypes.bool,
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default memo(IconButton);
