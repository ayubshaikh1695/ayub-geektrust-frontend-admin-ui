import { useState, useEffect, Fragment, memo, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Table,
  Typography,
  IconButton,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Button,
  Checkbox,
  Radio,
} from "components";
import { PaginatedNavigation } from "widgets";
import { isValidEmail } from "utils";
import {
  PAGINATION_ITEMS_PER_PAGE,
  PAGINATION_SPECIAL_BUTTON,
} from "utils/constants";
import styles from "./users-table.module.css";

const UsersTable = (props) => {
  // props
  const { users } = props;

  // state
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allSelected, setAllSelected] = useState(false);

  const [disableActions, setDisableActions] = useState({
    search: false,
    select: false,
    edit: false,
    delete: false,
    deleteSelected: true,
    pagination: false,
  });

  const [editingRow, setEditingRow] = useState({
    indexInPage: -1,
    name: "",
    email: "",
    role: "",
  });

  const [editingRowValidation, setEditingRowValidation] = useState({
    name: { error: false, errorMessage: "" },
    email: { error: false, errorMessage: "" },
  });

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    pageFirstItemIndex: 0,
    pageLastItemIndex: PAGINATION_ITEMS_PER_PAGE - 1,
    itemsCount: 0,
  });

  // effects
  useEffect(() => {
    if (users.length) {
      const result = users.map((user) => ({
        ...user,
        selected: false,
      }));

      setAllUsers(result);
      setFilteredUsers(structuredClone(result));
      setPagination((prevState) => ({
        ...prevState,
        totalPages: Math.ceil(result.length / PAGINATION_ITEMS_PER_PAGE),
        itemsCount: result.length,
      }));
    }
  }, [users]);

  useEffect(() => {
    setPagination((prevState) => ({
      ...prevState,
      totalPages: Math.ceil(filteredUsers.length / PAGINATION_ITEMS_PER_PAGE),
      itemsCount: filteredUsers.length,
    }));
  }, [filteredUsers]);

  // functions
  // validates fields in editingRowValidation state and updates the error state and
  // the error message of the particular field also returning the validation boolean value
  const isFormValid = useCallback(() => {
    const editingRowValidationCopy = { ...editingRowValidation };
    let valid = true;

    if (!editingRow.name.trim().length) {
      editingRowValidationCopy.name.error = true;
      editingRowValidationCopy.name.errorMessage = "Please type name first";
      valid = false;
    } else {
      editingRowValidationCopy.name.error = false;
      editingRowValidationCopy.name.errorMessage = "";
    }

    if (
      !editingRow.email.trim().length ||
      !isValidEmail(editingRow.email.trim())
    ) {
      editingRowValidationCopy.email.error = true;
      editingRowValidationCopy.email.errorMessage =
        "Please type valid email first";
      valid = false;
    } else {
      editingRowValidationCopy.email.error = false;
      editingRowValidationCopy.email.errorMessage = "";
    }

    setEditingRowValidation(editingRowValidationCopy);

    return valid;
  }, [editingRowValidation, editingRow]);

  const filterSearchResults = useCallback(
    (query) => {
      const result = allUsers.filter((user) => {
        const searchQuery = query.toLowerCase();
        return (
          user.name.toLowerCase().startsWith(searchQuery) ||
          user.email.toLowerCase().startsWith(searchQuery) ||
          user.role.toLowerCase().startsWith(searchQuery)
        );
      });

      setFilteredUsers(structuredClone(result));
    },
    [allUsers]
  );

  const handleSearchInput = useCallback(
    (e) => {
      const query = e.target.value;
      setSearchQuery(query);
      filterSearchResults(query);
      setPagination((prevState) => ({
        ...prevState,
        page: 1,
        pageFirstItemIndex: 0,
        pageLastItemIndex: PAGINATION_ITEMS_PER_PAGE - 1,
      }));
    },
    [filterSearchResults]
  );

  const handleSelectAll = useCallback(
    (e) => {
      const checked = e.target.checked;
      const usersCopy = [...filteredUsers];

      for (
        let i = pagination.pageFirstItemIndex;
        i <= pagination.pageLastItemIndex;
        i++
      ) {
        if (!usersCopy[i]) {
          break;
        }

        usersCopy[i].selected = checked;
      }

      setAllSelected(checked);
      setFilteredUsers(usersCopy);
      setDisableActions((prevState) => ({
        ...prevState,
        search: checked,
        edit: checked,
        delete: checked,
        deleteSelected: !checked,
        pagination: checked,
      }));
    },
    [filteredUsers, pagination]
  );

  const handleSelectUser = useCallback(
    (e, index) => {
      const checked = e.target.checked;
      const usersCopy = [...filteredUsers];
      usersCopy[pagination.pageFirstItemIndex + index].selected = checked;

      const slicedUsers = usersCopy.slice(
        pagination.pageFirstItemIndex,
        pagination.pageLastItemIndex + 1
      );

      const someSelected = slicedUsers.some((user) => user.selected);
      const someNotSelected = slicedUsers.some((user) => !user.selected);

      setAllSelected(!someNotSelected);
      setFilteredUsers(usersCopy);
      setDisableActions((prevState) => ({
        ...prevState,
        search: someSelected,
        edit: someSelected,
        delete: someSelected,
        deleteSelected: !someSelected,
        pagination: someSelected,
      }));
    },
    [filteredUsers, pagination]
  );

  const resetDisableActions = () => {
    setDisableActions({
      search: false,
      select: false,
      edit: false,
      delete: false,
      deleteSelected: true,
      pagination: false,
    });
  };

  const handlePageChange = useCallback(
    (page) => {
      let pageFirstItemIndex;
      let pageLastItemIndex;

      switch (page) {
        case PAGINATION_SPECIAL_BUTTON.first:
          pageFirstItemIndex = 0;
          pageLastItemIndex = PAGINATION_ITEMS_PER_PAGE - 1;

          setPagination((prevState) => ({
            ...prevState,
            page: 1,
            pageFirstItemIndex,
            pageLastItemIndex,
          }));

          break;
        case PAGINATION_SPECIAL_BUTTON.previous:
          pageFirstItemIndex =
            pagination.pageFirstItemIndex - PAGINATION_ITEMS_PER_PAGE;
          pageLastItemIndex =
            pageFirstItemIndex + PAGINATION_ITEMS_PER_PAGE - 1;

          setPagination((prevState) => ({
            ...prevState,
            page: prevState.page - 1,
            pageFirstItemIndex,
            pageLastItemIndex,
          }));

          break;
        case PAGINATION_SPECIAL_BUTTON.next:
          pageFirstItemIndex =
            pagination.pageFirstItemIndex + PAGINATION_ITEMS_PER_PAGE;
          pageLastItemIndex =
            pageFirstItemIndex + PAGINATION_ITEMS_PER_PAGE - 1;

          setPagination((prevState) => ({
            ...prevState,
            page: prevState.page + 1,
            pageFirstItemIndex,
            pageLastItemIndex,
          }));

          break;
        case PAGINATION_SPECIAL_BUTTON.last:
          pageFirstItemIndex =
            PAGINATION_ITEMS_PER_PAGE * (pagination.totalPages - 1);
          pageLastItemIndex =
            pageFirstItemIndex + PAGINATION_ITEMS_PER_PAGE - 1;

          setPagination((prevState) => ({
            ...prevState,
            page: pagination.totalPages,
            pageFirstItemIndex,
            pageLastItemIndex,
          }));

          break;
        default:
          pageFirstItemIndex = PAGINATION_ITEMS_PER_PAGE * (page - 1);
          pageLastItemIndex =
            pageFirstItemIndex + PAGINATION_ITEMS_PER_PAGE - 1;

          setPagination((prevState) => ({
            ...prevState,
            page,
            pageFirstItemIndex,
            pageLastItemIndex,
          }));
      }
    },
    [pagination]
  );

  const handleDeleteSelected = useCallback(() => {
    const allUsersCopy = [...allUsers];
    let filteredUsersCopy = [...filteredUsers];

    for (
      let i = pagination.pageFirstItemIndex;
      i <= pagination.pageLastItemIndex;
      i++
    ) {
      const user = filteredUsersCopy[i];

      if (!user) {
        break;
      }

      if (user.selected) {
        const indexInAllUsers = allUsersCopy.findIndex(
          (item) => item.id === user.id
        );

        if (indexInAllUsers > -1) {
          allUsersCopy.splice(indexInAllUsers, 1);
        }
      }
    }

    setAllUsers(allUsersCopy);

    filteredUsersCopy = filteredUsersCopy.filter((user) => !user.selected);
    setFilteredUsers(filteredUsersCopy);

    // if all items are deleted from current page, take to previous page
    if (
      pagination.page > 1 &&
      !filteredUsersCopy[pagination.pageFirstItemIndex]
    ) {
      handlePageChange(PAGINATION_SPECIAL_BUTTON.previous);
    }

    setAllSelected(false);
    resetDisableActions();
  }, [allUsers, pagination, filteredUsers, handlePageChange]);

  const handleEditRow = useCallback(
    (index) => {
      const indexInUsers = pagination.pageFirstItemIndex + index;

      setEditingRow((prevState) => ({
        ...prevState,
        indexInPage: index,
        name: filteredUsers[indexInUsers].name,
        email: filteredUsers[indexInUsers].email,
        role: filteredUsers[indexInUsers].role,
      }));

      setDisableActions((prevState) => ({
        ...prevState,
        search: true,
        select: true,
        edit: true,
        delete: true,
        deleteSelected: true,
        pagination: true,
      }));
    },
    [pagination, filteredUsers]
  );

  const handleDeleteRow = useCallback(
    (index) => {
      const allUsersCopy = [...allUsers];
      const filteredUsersCopy = [...filteredUsers];
      const indexInFilteredUsers = pagination.pageFirstItemIndex + index;
      const indexInAllUsers = allUsersCopy.findIndex(
        (item) => item.id === filteredUsersCopy[indexInFilteredUsers].id
      );

      allUsersCopy.splice(indexInAllUsers, 1);
      filteredUsersCopy.splice(indexInFilteredUsers, 1);

      setAllUsers(allUsersCopy);
      setFilteredUsers(filteredUsersCopy);

      // if all items are deleted from current page, take to previous page
      if (
        pagination.page > 1 &&
        !filteredUsersCopy[pagination.pageFirstItemIndex]
      ) {
        handlePageChange(PAGINATION_SPECIAL_BUTTON.previous);
      }
    },
    [allUsers, filteredUsers, pagination, handlePageChange]
  );

  const handleEditingRowInput = useCallback(
    (e) => {
      const name = e.target.name;
      const value = e.target.value;

      setEditingRow((prevState) => ({
        ...prevState,
        [name]: value,
      }));

      if (value.length && editingRowValidation[name].error) {
        setEditingRowValidation((prevState) => ({
          ...prevState,
          [name]: { error: false, errorMessage: "" },
        }));
      }
    },
    [editingRowValidation]
  );

  const closeEditingRow = useCallback(() => {
    setEditingRow({
      index: -1,
      name: "",
      email: "",
      role: "",
    });

    resetDisableActions();

    setEditingRowValidation({
      name: { error: false, errorMessage: "" },
      email: { error: false, errorMessage: "" },
    });
  }, []);

  const saveEditingRow = useCallback(() => {
    if (isFormValid()) {
      const allUsersCopy = [...allUsers];
      const filteredUsersCopy = [...filteredUsers];
      const indexInFilteredUsers =
        pagination.pageFirstItemIndex + editingRow.indexInPage;
      const indexInAllUsers = allUsersCopy.findIndex(
        (item) => item.id === filteredUsersCopy[indexInFilteredUsers].id
      );

      allUsersCopy[indexInAllUsers].name = editingRow.name;
      allUsersCopy[indexInAllUsers].email = editingRow.email;
      allUsersCopy[indexInAllUsers].role = editingRow.role;

      filteredUsersCopy[indexInFilteredUsers].name = editingRow.name;
      filteredUsersCopy[indexInFilteredUsers].email = editingRow.email;
      filteredUsersCopy[indexInFilteredUsers].role = editingRow.role;

      setAllUsers(allUsersCopy);
      setFilteredUsers(filteredUsersCopy);
      closeEditingRow();
    }
  }, [
    allUsers,
    filteredUsers,
    pagination,
    editingRow,
    closeEditingRow,
    isFormValid,
  ]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchRow}>
        <TextField
          placeholder="Search by name, email or role"
          value={searchQuery}
          disableHelperText
          disabled={disableActions.search || !allUsers.length}
          onChange={handleSearchInput}
        />
      </div>
      <Table cssClass={styles.table}>
        <TableHead>
          <TableRow cssClass={`${styles.tableRow} ${styles.tableHeadingRow}`}>
            <TableCell>
              <Checkbox
                checked={allSelected}
                disabled={disableActions.select || !filteredUsers.length}
                onChange={handleSelectAll}
              />
              <Typography
                variant="subtitle"
                cssClass={`${styles.onMobile} ${
                  disableActions.select || !filteredUsers.length
                    ? styles.disabledText
                    : ""
                }`}
              >
                &nbsp;Select All
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle">Name</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle">Email</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle">Role</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle">Actions</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody cssClass={styles.tableBody}>
          {filteredUsers.length ? (
            <Fragment>
              {filteredUsers
                .slice(
                  pagination.pageFirstItemIndex,
                  pagination.pageLastItemIndex + 1
                )
                .map((user, index) => (
                  <TableRow
                    key={user.id}
                    selected={user.selected}
                    cssClass={styles.tableRow}
                  >
                    <TableCell>
                      <Checkbox
                        checked={user.selected}
                        disabled={disableActions.select}
                        onChange={(e) => handleSelectUser(e, index)}
                      />
                    </TableCell>
                    {index === editingRow.indexInPage ? (
                      <TableCell cssClass={styles.editingRowCell}>
                        <TextField
                          name="name"
                          placeholder="Enter name"
                          value={editingRow.name}
                          error={editingRowValidation.name.error}
                          errorMessage={editingRowValidation.name.errorMessage}
                          onChange={handleEditingRowInput}
                        />
                      </TableCell>
                    ) : (
                      <TableCell>
                        <Typography
                          variant="subtitle"
                          cssClass={styles.onMobile}
                        >
                          Name:&nbsp;
                        </Typography>
                        <Typography variant="body">{user.name}</Typography>
                      </TableCell>
                    )}
                    {index === editingRow.indexInPage ? (
                      <TableCell cssClass={styles.editingRowCell}>
                        <TextField
                          name="email"
                          placeholder="Enter email"
                          value={editingRow.email}
                          error={editingRowValidation.email.error}
                          errorMessage={editingRowValidation.email.errorMessage}
                          onChange={handleEditingRowInput}
                        />
                      </TableCell>
                    ) : (
                      <TableCell>
                        <Typography
                          variant="subtitle"
                          cssClass={styles.onMobile}
                        >
                          Email:&nbsp;
                        </Typography>
                        <Typography variant="body" cssClass="word-break-all">
                          {user.email}
                        </Typography>
                      </TableCell>
                    )}
                    {index === editingRow.indexInPage ? (
                      <TableCell cssClass={styles.editingRowCell}>
                        <Radio
                          name="role"
                          value="admin"
                          label="Admin"
                          checked={editingRow.role === "admin"}
                          onChange={handleEditingRowInput}
                        />
                        <Radio
                          name="role"
                          value="member"
                          label="Member"
                          checked={editingRow.role === "member"}
                          onChange={handleEditingRowInput}
                        />
                      </TableCell>
                    ) : (
                      <TableCell>
                        <Typography
                          variant="subtitle"
                          cssClass={styles.onMobile}
                        >
                          Role:&nbsp;
                        </Typography>
                        <Typography variant="body" cssClass="text-capitalize">
                          {user.role}
                        </Typography>
                      </TableCell>
                    )}
                    {index === editingRow.indexInPage ? (
                      <TableCell cssClass={styles.editingRowCell}>
                        <Button
                          label="Save"
                          variant="primary"
                          size="small"
                          onClick={saveEditingRow}
                        />
                        <Button
                          label="Cancel"
                          variant="secondary"
                          size="small"
                          outlined
                          onClick={closeEditingRow}
                        />
                      </TableCell>
                    ) : (
                      <TableCell>
                        <IconButton
                          faIconClass="fa-regular fa-pen-to-square"
                          disabled={disableActions.edit}
                          onClick={() => handleEditRow(index)}
                        />
                        <IconButton
                          faIconClass={`fa-regular fa-trash-can color-danger`}
                          disabled={disableActions.delete}
                          onClick={() => handleDeleteRow(index)}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
            </Fragment>
          ) : (
            <div className={styles.noResultsContainer}>
              <Typography variant="body">No results found</Typography>
            </div>
          )}
        </TableBody>
        {filteredUsers.length > 0 && (
          <div className={styles.tableActionsContainer}>
            <Button
              label="Delete Selected"
              variant="secondary"
              disabled={disableActions.deleteSelected}
              onClick={handleDeleteSelected}
            />
            <PaginatedNavigation
              page={pagination.page}
              itemsCount={pagination.itemsCount}
              itemsPerPage={PAGINATION_ITEMS_PER_PAGE}
              disableAllButton={disableActions.pagination}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </Table>
    </div>
  );
};

UsersTable.propTypes = {
  users: PropTypes.array,
};

export default memo(UsersTable);
