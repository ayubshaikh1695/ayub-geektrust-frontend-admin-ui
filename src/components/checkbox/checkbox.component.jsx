import { memo } from "react";
import PropTypes from "prop-types";

const Checkbox = (props) => {
  const { checked, disabled, onChange } = props;

  return (
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={onChange}
    />
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default memo(Checkbox);
