import { memo } from "react";
import PropTypes from "prop-types";
import Typography from "components/typography/typography.component";
import styles from "./button.module.css";

// supported variants
const VARIANTS = { primary: "primary", secondary: "secondary" };
// supported sizes
const SIZES = { small: "small", medium: "medium" };

const Button = (props) => {
  const { label, variant, size, outlined, disabled, onClick } = props;

  let buttonClass = styles.buttonBase;

  if (VARIANTS[variant]) {
    buttonClass += ` ${styles[variant]}`;
  }

  if (SIZES[size]) {
    buttonClass += ` ${styles[size]}`;
  }

  if (outlined === true) {
    buttonClass += ` ${styles.outlined}`;
  }

  return (
    <button className={buttonClass} disabled={disabled} onClick={onClick}>
      <Typography variant="button-text">{label || "Button"}</Typography>
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string,
  variant: PropTypes.string,
  size: PropTypes.string,
  outlined: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default memo(Button);
