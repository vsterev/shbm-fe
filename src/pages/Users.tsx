import React, { useEffect, useState } from "react";
import userService from "../services/user";
import appCookie from "../utils/appCookie";
import AddUser from "../components/users/AddUser";
import type {
  AddUser as AddUserType,
  GetUser,
} from "../interfaces/user.interface";
import { View, Text, Button, Table, useToggle, Checkbox } from "reshaped";
import { Plus } from "react-feather";
import DeleteAlert from "../components/shared/DeleteAlert";

const Users = () => {
  const [users, setUsers] = useState<GetUser[] | undefined>(undefined);
  const [toggleAddUser, setToggleAddUser] = useState<boolean>(false);
  const [editUser, setEditUser] = useState<AddUserType>({} as AddUserType);
  const [deleteUser, setDeleteUser] = useState<GetUser | undefined>(undefined);

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

  const deleteHandler = async () => {
    // if (window.confirm("please agrre to delete user")) {
    if (!deleteUser) return;
    if (deleteUser.email !== "vasil@solvex.bg") {
      try {
        await userService.delete({ _id: deleteUser._id }, token);
        userList();
      } catch (error) {
        console.error(error);
      }
    }
    // }
  };

  const toggleAdd = () => {
    setEditUser({} as AddUserType);
    setToggleAddUser(!toggleAddUser);
  };

  const editHandler = (user: GetUser) => {
    toggle();
    setToggleAddUser(false);
    setEditUser(user);
  };

  const { toggle, deactivate, active } = useToggle(false);
  const {
    active: activeDelete,
    activate: activateDelete,
    deactivate: deactivateDelete,
  } = useToggle(false);

  return (
    <View direction="column" align="center">
      <View
        direction="row"
        justify="space-between"
        width="90%"
        align="center"
        height={20}
      >
        <Text variant="featured-2">User managment</Text>
        <Button
          onClick={() => {
            toggle();
            toggleAdd();
          }}
          variant="outline"
          color="primary"
          endIcon={Plus}
          size="small"
        >
          add user
        </Button>
      </View>
      <View width="90%">
        <Table border>
          <Table.Head>
            <Table.Row highlighted>
              <Table.Heading>№</Table.Heading>
              <Table.Heading>email</Table.Heading>
              <Table.Heading>name</Table.Heading>
              <Table.Heading>isAdmin</Table.Heading>
              <Table.Heading>actions</Table.Heading>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {Array.isArray(users) &&
              users?.map((el, i) => {
                return (
                  <React.Fragment key={el._id}>
                    <Table.Row>
                      <Table.Cell>{i + 1}</Table.Cell>
                      <Table.Cell>{el.email}</Table.Cell>
                      <Table.Cell>{el.name}</Table.Cell>
                      {/* <Table.Cell>{el.isAdmin ? "yes" : "no"}</Table.Cell> */}
                      <Table.Cell>
                        <Checkbox checked={el.isAdmin} />
                      </Table.Cell>
                      <Table.Cell>
                        <View gap={2} direction="row">
                          <Button
                            disabled={el.email === "vasil@solvex.bg"}
                            onClick={() => editHandler(el)}
                            size="small"
                            color="primary"
                            variant="outline"
                          >
                            edit
                          </Button>
                          <Button
                            // onClick={() => deleteHandler(el)}
                            onClick={() => {
                              setDeleteUser(el);
                              activateDelete();
                            }}
                            disabled={el.email === "vasil@solvex.bg"}
                            color="critical"
                            size="small"
                            variant="outline"
                          >
                            delete
                          </Button>
                        </View>
                      </Table.Cell>
                    </Table.Row>
                  </React.Fragment>
                );
              })}
          </Table.Body>
        </Table>
      </View>
      {active && (
        <AddUser
          setUsers={setUsers}
          toggleAdd={toggleAdd}
          toggle={toggle}
          deactivate={deactivate}
          active={active}
          action="new"
        />
      )}
      {Object.keys(editUser).length > 0 && (
        <AddUser
          toggle={toggle}
          deactivate={deactivate}
          active={active}
          setUsers={setUsers}
          setEditUser={setEditUser}
          editUser={editUser}
          action="edit"
        />
      )}
      {activeDelete && (
        <DeleteAlert
          deleteFunction={deleteHandler}
          deactivate={deactivateDelete}
          active={activeDelete}
        />
      )}
    </View>
  );
};
export default Users;
