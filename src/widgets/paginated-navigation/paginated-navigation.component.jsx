import { useState, useEffect, memo } from "react";
import PropTypes from "prop-types";
import { IconButton } from "components";
import { PAGINATION_SPECIAL_BUTTON } from "utils/constants";
import styles from "./paginated-navigation.module.css";

const PaginatedNavigation = (props) => {
  const { page, itemsCount, itemsPerPage, disableAllButton, onPageChange } =
    props;

  const [pages, setPages] = useState([]);
  const [disableButton, setDisableButton] = useState({
    first: false,
    previous: false,
    next: false,
    last: false,
  });

  useEffect(() => {
    const totalPages = Math.ceil(itemsCount / itemsPerPage);
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    setPages(pages);

    setDisableButton({
      first: page === 1,
      previous: page === 1,
      next: page === totalPages,
      last: page === totalPages,
    });
  }, [page, itemsCount, itemsPerPage]);

  return (
    <ul className={styles.wrapper}>
      <li>
        <IconButton
          variant="primary"
          faIconClass="fa-solid fa-angles-left"
          disabled={disableAllButton || disableButton.first}
          outlined
          onClick={() => {
            onPageChange(PAGINATION_SPECIAL_BUTTON.first);
          }}
        />
      </li>
      <li>
        <IconButton
          variant="primary"
          faIconClass="fa-solid fa-angle-left"
          disabled={disableAllButton || disableButton.previous}
          outlined
          onClick={() => {
            onPageChange(PAGINATION_SPECIAL_BUTTON.previous);
          }}
        />
      </li>
      {pages.map((pageNum) => (
        <li key={pageNum}>
          <IconButton
            variant="primary"
            label={pageNum}
            disabled={disableAllButton}
            outlined
            selected={pageNum === page}
            onClick={
              pageNum !== page
                ? () => {
                    onPageChange(pageNum);
                  }
                : null
            }
          />
        </li>
      ))}
      <li>
        <IconButton
          variant="primary"
          faIconClass="fa-solid fa-angle-right"
          disabled={disableAllButton || disableButton.next}
          outlined
          onClick={() => {
            onPageChange(PAGINATION_SPECIAL_BUTTON.next);
          }}
        />
      </li>
      <li>
        <IconButton
          variant="primary"
          faIconClass="fa-solid fa-angles-right"
          disabled={disableAllButton || disableButton.last}
          outlined
          onClick={() => {
            onPageChange(PAGINATION_SPECIAL_BUTTON.last);
          }}
        />
      </li>
    </ul>
  );
};

PaginatedNavigation.propTypes = {
  page: PropTypes.number,
  itemsCount: PropTypes.number,
  itemsPerPage: PropTypes.number,
  disableAllButton: PropTypes.bool,
  onPageChange: PropTypes.func,
};

export default memo(PaginatedNavigation);
