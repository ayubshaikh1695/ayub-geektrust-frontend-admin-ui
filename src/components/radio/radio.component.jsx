import { memo } from "react";
import PropTypes from "prop-types";
import { Typography } from "components";
import styles from "./radio.module.css";

const Radio = (props) => {
  const { name, value, label, checked, disabled, onChange } = props;

  return (
    <div className={styles.wrapper}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <Typography variant="body">{label}</Typography>
    </div>
  );
};

Radio.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default memo(Radio);
