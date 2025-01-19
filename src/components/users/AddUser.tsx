import { useEffect, useState } from "react";
import userService from "../../services/user";
import parseCookie from "../../utils/parseCookie";
import styles from "../styles/History.module.css";
import type { AddUser, EditUser, GetUser } from "../../interfaces/user.interface";

interface AddUserProps {
  setUsers: (users: GetUser[]) => void;
  action: "new" | "edit";
  toggleAdd?: () => void;
  editUser?: AddUser;
  setEditUser?: (user: AddUser) => void;
}

const AddUser = ({ setUsers, toggleAdd, action, editUser, setEditUser }: AddUserProps) => {

  const [userParams, setUserParams] = useState<AddUser | EditUser>({ isAdmin: false } as AddUser);

  const [err, setErr] = useState<string>("");

  const token = parseCookie("parser-token");

  useEffect(() => {
    if (action === "edit") {
      setUserParams({ ...editUser, isAdmin: editUser?.isAdmin ?? false, name: editUser?.name || "", email: editUser?.email || undefined, password: undefined, repass: undefined });
    }
  }, [editUser]);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "isAdmin") {
      setUserParams({ ...userParams, isAdmin: !userParams.isAdmin });
      return;
    }
    setUserParams({ ...userParams, [name]: value });
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userParams.password !== userParams.repass && action === "new") {
      return setErr("password mismatch");
    }
    delete userParams.repass;
    const handleUserAction = async () => {
      try {
        if (action === "new") {
          if (!toggleAdd) {
            return;
          }
          const registeredUser = await userService.register(userParams as AddUser, token);
          if (registeredUser.error) {
            setErr(registeredUser.error);
          } else {
            toggleAdd();
          }
        } else {
          const editedUser = await userService.edit(userParams as EditUser, token);
          if (editedUser.error) {
            setErr(editedUser.error);
          }
          if (setEditUser) {
            setEditUser({} as AddUser);
          }
        }
        const users = await userService.allUsers(token);
        setUsers(users);
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          setErr(error.message);
        } else {
          setErr("An unknown error occurred");
        }
      }
    };

    handleUserAction();
  };

  useEffect(() => {
    if (err) {
      const timer = setTimeout(() => {
        setErr("");
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [err]);

  const blurHandler = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (e.target.value !== userParams.password) {
      setErr("password mismatch");
      return;
    }
    setErr("");
  };

  return (
    <>
      <div className={styles.historyTopWrap}>
        {action === "new" ? (
          <h3>Add a new user</h3>
        ) : (
          <h3>Edit existing user</h3>
        )}
        <form onSubmit={submitHandler}>
          <label htmlFor="email">email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={userParams.email || ""}
            onChange={(e) => changeHandler(e)}
            disabled={action === "edit"}
          />
          <label htmlFor="name">name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={userParams.name || ""}
            onChange={(e) => changeHandler(e)}
          />
          <label htmlFor="isAdmin">is admin</label>
          <input
            type="checkbox"
            id="isAdmin"
            name="isAdmin"
            checked={userParams.isAdmin}
            onChange={(e) => changeHandler(e)}
          />
          <label htmlFor="pass">password</label>
          <input
            type="password"
            id="pass"
            name="password"
            value={userParams.password || ""}
            onChange={(e) => changeHandler(e)}
          />
          <label htmlFor="repass">retype password</label>
          <input
            type="password"
            id="repass"
            name="repass"
            value={userParams.repass || ""}
            onChange={(e) => changeHandler(e)}
            onBlur={(e) => blurHandler(e)}
          />
          <button
            disabled={
              action === "new" &&
              (!userParams.email ||
                !userParams.name ||
                !userParams.password ||
                !userParams.repass) ||
              err !== ""
            }
            className={styles.submitButton}
          >
            submit
          </button>
        </form>
        <div className={styles.error}>
          {err}
        </div>
      </div>
    </>
  );
};
export default AddUser;