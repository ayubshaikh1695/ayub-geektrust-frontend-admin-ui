import { isEmpty } from "utils";

export const API_BASE_URL = "https://geektrust.s3-ap-southeast-1.amazonaws.com";

export const get = async (url, params) => {
  const response = await fetch(
    `${API_BASE_URL}${url}${
      !isEmpty(params) ? `?${new URLSearchParams(params)}` : ""
    }`
  );
  const data = await response.json();

  return data;
};
