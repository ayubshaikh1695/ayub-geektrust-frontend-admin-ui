import { useState, useEffect } from "react";
import { UsersTable } from "widgets";
import { get } from "utils/api";
import { USERS_ENDPOINT } from "utils/constants";
import styles from "./home.module.css";

const Home = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = () => {
      get(USERS_ENDPOINT).then((res) => {
        if (Array.isArray(res) && res.length) {
          setUsers(res);
        }
      });
    };

    fetchUsers();
  }, []);

  return (
    <div className={styles.wrapper}>
      <UsersTable users={users} />
    </div>
  );
};

export default Home;
