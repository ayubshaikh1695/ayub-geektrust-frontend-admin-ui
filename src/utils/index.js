import { EMAIL_REGEX } from "./constants";

export const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};

export const isValidEmail = (str) => {
  return EMAIL_REGEX.test(str);
};
