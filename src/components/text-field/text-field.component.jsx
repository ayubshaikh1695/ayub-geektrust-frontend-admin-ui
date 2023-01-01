import { memo } from "react";
import PropTypes from "prop-types";
import Typography from "components/typography/typography.component";
import styles from "./text-field.module.css";

const TextField = (props) => {
  const {
    name,
    placeholder,
    value,
    error,
    errorMessage,
    disableHelperText,
    disabled,
    autoFocus,
    onChange,
    onKeyUp,
  } = props;

  let inputFieldClass = styles.inputFieldBase;

  if (error === true) {
    inputFieldClass += ` ${styles.error}`;
  }

  return (
    <div className={styles.wrapper}>
      <input
        className={inputFieldClass}
        type="text"
        name={name}
        placeholder={placeholder || ""}
        value={value}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={onChange}
        onKeyUp={onKeyUp}
      />
      {!disableHelperText && (
        <div className={styles.errorMsgContainer}>
          <Typography variant="caption-text">{errorMessage}</Typography>
        </div>
      )}
    </div>
  );
};

TextField.propTypes = {
  name: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  disableHelperText: PropTypes.bool,
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  onChange: PropTypes.func,
  onKeyUp: PropTypes.func,
};

export default memo(TextField);
