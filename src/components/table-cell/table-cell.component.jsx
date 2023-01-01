import { memo } from "react";
import PropTypes from "prop-types";
import styles from "./table-cell.module.css";

const TableCell = (props) => {
  const { children, cssClass } = props;

  let wrapperCss = styles.wrapper;

  if (cssClass) {
    wrapperCss += ` ${cssClass}`;
  }

  return <div className={wrapperCss}>{children}</div>;
};

TableCell.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  cssClass: PropTypes.string,
};

export default memo(TableCell);
