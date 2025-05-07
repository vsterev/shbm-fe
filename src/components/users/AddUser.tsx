import { useState } from 'react';
import userService from '../../services/user';
import appCookie from '../../utils/appCookie';
import type { AddUser, EditUser, GetUser } from '../../interfaces/user.interface';
import { Button, Checkbox, Dismissible, FormControl, Modal, Text, TextField, View } from 'reshaped';
import { useForm, Controller } from 'react-hook-form';
import { UserFormData, userSchema } from '../../schemas/User.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'react-feather';
import useToastService from '../../utils/toastService';

interface AddUserProps {
  setUsers: (users: GetUser[]) => void;
  action: 'new' | 'edit';
  toggleAdd?: () => void;
  editUser?: EditUser;
  toggle: () => void;
  deactivate: () => void;
  active: boolean;
}

const AddUser = ({ setUsers, toggleAdd, action, editUser, deactivate, active }: AddUserProps) => {
  const [passwordView, setPasswordView] = useState(false);

  const token = appCookie('hbs-token');

  const toast = useToastService();

  // useEffect(() => {
  //   if (action === "edit") {
  //     setUserParams({
  //       ...editUser,
  //       isAdmin: editUser?.isAdmin ?? false,
  //       name: editUser?.name || "",
  //       email: editUser?.email || undefined,
  //       password: undefined,
  //       repass: undefined,
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [editUser]);

  // const changeHandler = (e: {
  //   name: string;
  //   value?: string;
  //   checked?: boolean;
  //   event?: React.ChangeEvent<HTMLInputElement>;
  // }) => {
  //   const { name, value } = e;
  //   if (name === "isAdmin") {
  //     setUserParams({ ...userParams, isAdmin: !userParams.isAdmin });
  //     return;
  //   }
  //   setUserParams({ ...userParams, [name]: value });
  // };

  // const submitHandler = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (userParams.password !== userParams.repass && action === "new") {
  //     return setErr("password mismatch");
  //   }
  //   delete userParams.repass;
  //   const handleUserAction = async () => {
  //     try {
  //       if (action === "new") {
  //         if (!toggleAdd) {
  //           return;
  //         }
  //         const registeredUser = await userService.register(
  //           userParams as AddUser,
  //           token,
  //         );
  //         if (registeredUser.error) {
  //           setErr(registeredUser.error);
  //         } else {
  //           toggleAdd();
  //           deactivate();
  //         }
  //       } else {
  //         const editedUser = await userService.edit(
  //           userParams as EditUser,
  //           token,
  //         );
  //         if (editedUser.error) {
  //           setErr(editedUser.error);
  //         }
  //         if (setEditUser) {
  //           setEditUser({} as AddUser);
  //         }
  //       }
  //       const users = await userService.allUsers(token);
  //       setUsers(users);
  //       deactivate();
  //     } catch (error) {
  //       console.error(error);
  //       if (error instanceof Error) {
  //         setErr(error.message);
  //       } else {
  //         setErr("An unknown error occurred");
  //       }
  //     }
  //   };

  //   handleUserAction();
  // };
  const submitHandler = async (data: UserFormData) => {
    delete data.repass;

    const editData = {
      ...data,
      password: data.password === '' ? undefined : data.password,
    };
    try {
      const user =
        action === 'new'
          ? await userService.register(data as AddUser, token)
          : await userService.edit(editData as EditUser, token);
      if (!user) {
        throw Error('Error updating or creating an user');
      } else {
        if (toggleAdd) {
          toggleAdd();
        }
        deactivate();
      }
      const users = await userService.allUsers(token);
      setUsers(users);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.warning(error.message);
      } else {
        toast.warning('An unknown error occurred');
      }
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema(action === 'new')),
    defaultValues: {
      _id: editUser?._id || undefined,
      email: editUser?.email || '',
      name: editUser?.name || '',
      password: '',
      repass: '',
      isAdmin: editUser?.isAdmin || false,
    },
  });

  return (
    <Modal
      active={active}
      onClose={deactivate}
      position="end"
      // transparentOverlay
      overflow="visible"
    >
      <View direction="row" justify="space-between">
        {action === 'new' ? (
          <Text variant="featured-2">Add a new user</Text>
        ) : (
          <Text variant="featured-2">Edit existing user</Text>
        )}
        <Dismissible closeAriaLabel="Close banner" onClose={deactivate} />
      </View>
      <form onSubmit={handleSubmit(submitHandler)}>
        <View paddingTop={5} direction="column" gap={5}>
          <FormControl required hasError={!!errors.email}>
            <FormControl.Label>email</FormControl.Label>
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <TextField
                  name={name}
                  value={value}
                  onChange={({ event }) => onChange(event)}
                  disabled={action === 'edit'}
                />
              )}
            />
            <FormControl.Error>{errors.email?.message}</FormControl.Error>
          </FormControl>

          <FormControl required hasError={!!errors.name}>
            <FormControl.Label>name</FormControl.Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  name={field.name}
                  value={field.value}
                  onChange={({ event }) => field.onChange(event)}
                />
              )}
            />
            <FormControl.Error>{errors.name?.message}</FormControl.Error>
          </FormControl>

          <FormControl hasError={!!errors.isAdmin}>
            <FormControl.Label>is admin</FormControl.Label>
            <Controller
              name="isAdmin"
              control={control}
              render={({ field }) => (
                <Checkbox
                  name={field.name}
                  checked={field.value}
                  onChange={({ event }) => field.onChange(event)}
                />
              )}
            />
            <FormControl.Error>{errors.isAdmin?.message}</FormControl.Error>
          </FormControl>

          <FormControl hasError={!!errors.password} required={action === 'new'}>
            <FormControl.Label>password</FormControl.Label>
            <Controller
              name="password"
              control={control}
              rules={{ required: action === 'new' }}
              render={({ field }) => (
                <TextField
                  name={field.name}
                  value={field.value}
                  onChange={({ event }) => field.onChange(event)}
                  inputAttributes={{ type: passwordView ? 'text' : 'password' }}
                  // endIcon={passwordView ? EyeOff : Eye}
                  endSlot={
                    <Button
                      icon={passwordView ? EyeOff : Eye}
                      size="small"
                      variant="ghost"
                      color="primary"
                      onClick={() => setPasswordView(!passwordView)}
                    />
                  }
                />
              )}
            />
            <FormControl.Error>{errors.password?.message}</FormControl.Error>
          </FormControl>

          <FormControl hasError={!!errors.repass} required={action === 'new'}>
            <FormControl.Label>retype password</FormControl.Label>
            <Controller
              name="repass"
              control={control}
              render={({ field }) => (
                <TextField
                  name={field.name}
                  value={field.value}
                  onChange={({ event }) => field.onChange(event)}
                  inputAttributes={{ type: passwordView ? 'text' : 'password' }}
                />
              )}
            />
            <FormControl.Error>{errors.repass?.message}</FormControl.Error>
          </FormControl>
          <Button type="submit" variant="outline" color="primary">
            Submit
          </Button>
          {/* <div>{err}</div> */}
        </View>
      </form>
    </Modal>
  );
};
export default AddUser;
