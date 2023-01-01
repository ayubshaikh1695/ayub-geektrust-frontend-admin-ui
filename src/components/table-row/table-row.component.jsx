import { memo } from "react";
import PropTypes from "prop-types";
import styles from "./table-row.module.css";

const TableRow = (props) => {
  const { children, selected, cssClass } = props;

  let wrapperCss = styles.wrapper;

  if (selected === true) {
    wrapperCss += ` ${styles.selected}`;
  }

  if (cssClass) {
    wrapperCss += ` ${cssClass}`;
  }

  return <div className={wrapperCss}>{children}</div>;
};

TableRow.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  selected: PropTypes.bool,
  cssClass: PropTypes.string,
};

export default memo(TableRow);
