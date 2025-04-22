import React, { useEffect, useState } from "react";
import userService from "../services/user";
import appCookie from "../utils/appCookie";
import styles from "./styles/tableView.module.css";
import style from "./styles/Bookings.module.css";
import style2 from "./styles/HotelMap.module.css";
import AddUser from "./users/AddUser";
import type {
  AddUser as AddUserType,
  GetUser,
} from "../interfaces/user.interface";
// import UserContext from '../utils/userContext';

const Users = () => {
  const [users, setUsers] = useState<GetUser[] | undefined>(undefined);
  const [toggleAddUser, setToggleAddUser] = useState<boolean>(false);
  const [editUser, setEditUser] = useState<AddUserType>({} as AddUserType);

  const token = appCookie("hbs-token");
  // const { logOut } = useContext(UserContext)

  const userList = () =>
    userService
      .allUsers(token)
      .then((usrs) => {
        // if (!!usrs.msg) {
        //     logOut();
        // }
        setUsers(usrs);
      })
      .catch(console.error);
  useEffect(() => {
    userList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteHandler = async (user: GetUser) => {
    if (window.confirm("please agrre to delete user")) {
      if (user.email !== "vasil@solvex.bg") {
        try {
          await userService.delete({ _id: user._id }, token);
          userList();
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  const toggleAdd = () => {
    setEditUser({} as AddUserType);
    setToggleAddUser(!toggleAddUser);
  };

  const editHandler = (user: GetUser) => {
    setToggleAddUser(false);
    setEditUser(user);
  };

  return (
    <>
      <div className={style.bookingWrap}>
        <h2>Users managment</h2>
        <div onClick={() => toggleAdd()} className={style.toggleButton}>
          + add user
        </div>
        <table className={styles.bookings}>
          <thead>
            <tr>
              <th>№</th>
              <th>email</th>
              <th>name</th>
              <th>isAdmin</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) &&
              users?.map((el, i) => {
                return (
                  <React.Fragment key={el._id}>
                    <tr>
                      <td>{i + 1}</td>
                      <td>{el.email}</td>
                      <td>{el.name}</td>
                      <td>{el.isAdmin ? "yes" : "no"}</td>
                      <td>
                        <button
                          disabled={el.email === "vasil@solvex.bg"}
                          onClick={() => editHandler(el)}
                          className={style2.submitButton}
                        >
                          edit
                        </button>
                        <button
                          onClick={() => deleteHandler(el)}
                          disabled={el.email === "vasil@solvex.bg"}
                          className={style2.deleteButton}
                        >
                          delete
                        </button>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
          </tbody>
        </table>
        {toggleAddUser && (
          <AddUser setUsers={setUsers} toggleAdd={toggleAdd} action="new" />
        )}
        {Object.keys(editUser).length > 0 && (
          <AddUser
            setUsers={setUsers}
            setEditUser={setEditUser}
            editUser={editUser}
            action="edit"
          />
        )}
      </div>
    </>
  );
};
export default Users;
