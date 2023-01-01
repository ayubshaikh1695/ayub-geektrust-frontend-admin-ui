import { memo } from "react";
import PropTypes from "prop-types";

const TableHead = (props) => {
  const { children, cssClass } = props;

  return <div className={cssClass || ""}>{children}</div>;
};

TableHead.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  cssClass: PropTypes.string,
};

export default memo(TableHead);
