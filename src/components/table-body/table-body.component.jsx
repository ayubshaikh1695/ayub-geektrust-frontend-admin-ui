import { memo } from "react";
import PropTypes from "prop-types";

const TableBody = (props) => {
  const { children, cssClass } = props;

  return <div className={cssClass || ""}>{children}</div>;
};

TableBody.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  cssClass: PropTypes.string,
};

export default memo(TableBody);
