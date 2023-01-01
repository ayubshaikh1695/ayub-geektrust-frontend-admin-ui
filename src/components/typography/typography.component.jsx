import { memo } from "react";
import PropTypes from "prop-types";
import styles from "./typography.module.css";

const VARIANTS = {
  subtitle: "subtitle",
  "button-text": "button-text",
  "caption-text": "caption-text",
  body: "body",
};

const Typography = (props) => {
  const { variant, cssClass } = props;

  let typographyClass = styles.typographyBase;

  if (VARIANTS[variant]) {
    typographyClass += ` ${styles[variant]}`;
  } else {
    typographyClass += ` ${styles.body}`;
  }

  if (cssClass) {
    typographyClass += ` ${cssClass}`;
  }

  switch (variant) {
    case "subtitle":
      return <h6 className={typographyClass}>{props.children}</h6>;

    case "button-text":
    case "caption-text":
      return <span className={typographyClass}>{props.children}</span>;

    case "body":
    default:
      return <p className={typographyClass}>{props.children}</p>;
  }
};

Typography.propTypes = {
  variant: PropTypes.string,
  cssClass: PropTypes.string,
};

export default memo(Typography);
