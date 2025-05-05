import { FormEvent, useEffect, useState } from "react";
import userService from "../../services/user";
import appCookie from "../../utils/appCookie";
import type {
  AddUser,
  EditUser,
  GetUser,
} from "../../interfaces/user.interface";
import {
  Button,
  Checkbox,
  Dismissible,
  FormControl,
  Modal,
  Text,
  TextField,
  View,
} from "reshaped";

interface AddUserProps {
  setUsers: (users: GetUser[]) => void;
  action: "new" | "edit";
  toggleAdd?: () => void;
  editUser?: AddUser;
  setEditUser?: (user: AddUser) => void;
  toggle: () => void;
  deactivate: () => void;
  active: boolean;
}

const AddUser = ({
  setUsers,
  toggleAdd,
  action,
  editUser,
  setEditUser,
  deactivate,
  active,
}: AddUserProps) => {
  const [userParams, setUserParams] = useState<AddUser | EditUser>({
    isAdmin: false,
  } as AddUser);

  const [err, setErr] = useState<string>("");

  const token = appCookie("hbs-token");

  useEffect(() => {
    if (action === "edit") {
      setUserParams({
        ...editUser,
        isAdmin: editUser?.isAdmin ?? false,
        name: editUser?.name || "",
        email: editUser?.email || undefined,
        password: undefined,
        repass: undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editUser]);
  console.log("v modala sym");

  const changeHandler = (e: {
    name: string;
    value?: string;
    checked?: boolean;
    event?: React.ChangeEvent<HTMLInputElement>;
  }) => {
    const { name, value } = e;
    if (name === "isAdmin") {
      setUserParams({ ...userParams, isAdmin: !userParams.isAdmin });
      return;
    }
    setUserParams({ ...userParams, [name]: value });
  };
  console.log("userParams", userParams);

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
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
          const registeredUser = await userService.register(
            userParams as AddUser,
            token,
          );
          if (registeredUser.error) {
            setErr(registeredUser.error);
          } else {
            toggleAdd();
            deactivate();
          }
        } else {
          const editedUser = await userService.edit(
            userParams as EditUser,
            token,
          );
          if (editedUser.error) {
            setErr(editedUser.error);
          }
          if (setEditUser) {
            setEditUser({} as AddUser);
          }
        }
        const users = await userService.allUsers(token);
        setUsers(users);
        deactivate();
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
  console.log(userParams?.password?.length);
  return (
    <Modal
      active={active}
      onClose={deactivate}
      position="end"
      // transparentOverlay
      overflow="visible"
    >
      <View direction="row" justify="space-between">
        {action === "new" ? (
          <Text variant="featured-2">Add a new user</Text>
        ) : (
          <Text variant="featured-2">Edit existing user</Text>
        )}
        <Dismissible closeAriaLabel="Close banner" onClose={deactivate} />
      </View>
      <form onSubmit={submitHandler}>
        <View paddingTop={5} direction="column" gap={5}>
          <FormControl required>
            <FormControl.Label>email</FormControl.Label>
            <TextField
              name="email"
              value={userParams.email || ""}
              onChange={(e) => changeHandler(e)}
              disabled={action === "edit"}
            />
            <FormControl.Error>Email is required</FormControl.Error>
          </FormControl>

          <FormControl required>
            <FormControl.Label>name</FormControl.Label>
            <TextField
              id="name"
              name="name"
              value={userParams.name || ""}
              onChange={(e) => changeHandler(e)}
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>is admin</FormControl.Label>
            <Checkbox
              name="isAdmin"
              checked={userParams.isAdmin}
              onChange={(e) => changeHandler(e)}
            />
          </FormControl>

          <FormControl
            hasError={
              userParams.password ? userParams.password.length < 6 : false
            }
          >
            <FormControl.Label>password</FormControl.Label>
            <TextField
              name="password"
              value={userParams.password || ""}
              onChange={(e) => changeHandler(e)}
              inputAttributes={{ type: "password" }}
            />
            <FormControl.Error>
              Password must be at least 6 characters long
            </FormControl.Error>
          </FormControl>

          <FormControl
            hasError={
              (userParams.repass &&
                userParams.password &&
                userParams.repass !== userParams.password) ||
              false
            }
          >
            <FormControl.Label>retype password</FormControl.Label>
            <TextField
              name="repass"
              inputAttributes={{ type: "password" }}
              value={userParams.repass || ""}
              onChange={(e) => changeHandler(e)}
              onBlur={(e) => blurHandler(e)}
            />
            <FormControl.Error>
              Password mismatch or password is required
            </FormControl.Error>
          </FormControl>
          <Button
            type="submit"
            disabled={
              (action === "new" &&
                (!userParams.email ||
                  !userParams.name ||
                  !userParams.password ||
                  !userParams.repass)) ||
              err !== ""
            }
            variant="outline"
            color="primary"
          >
            Submit
          </Button>
          <div>{err}</div>
        </View>
      </form>
    </Modal>
  );
};
export default AddUser;
