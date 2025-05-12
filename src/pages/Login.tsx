import { useState } from 'react';
import userService from '../services/user';
import { Helmet } from 'react-helmet-async';
import { useAuthContext } from '../contexts/auth.context';
import { Button, Text, View, Image, FormControl, TextField } from 'reshaped';
import { User, Lock, Eye, EyeOff } from 'react-feather';
import { Controller, useForm } from 'react-hook-form';
import { LoginFormData, LoginSchema } from '../schemas/Login.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import useToastService from '../utils/toastService';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
  // const { logIn } = useContext(UserContext);
  const { setUser } = useAuthContext();

  const toast = useToastService();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [passwordView, setPasswordView] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (data: LoginFormData) => {
    await userService
      .login({ email: data.email, password: data.password })
      .then((r) => {
        if (r.err) {
          toast.warning(r.err);
          return;
        }
        const { token, userData } = r;
        if (token && userData) {
          document.cookie = `hbs-token=${token}; path=/`;
          setUser(userData);
          navigate('/bookings');
        }
      })
      .catch((error) => {
        console.error(error);
        if (error instanceof Error) {
          toast.warning(error.message);
        } else {
          toast.warning('An unknown error occurred');
        }
      });
  };
  // const { register, handleSubmit } = useForm<LoginFormData>({
  return (
    <View padding={0}>
      <Helmet>
        <title>SHBM</title>
      </Helmet>
      {/* <h3>Login page</h3> */}
      <View
        zIndex={1}
        position="relative"
        justify="start"
        align="stretch"
        maxHeight="100vh"
        overflow="hidden"
      >
        <Image
          src="/images/background.jpg"
          attributes={{
            style: {
              filter: 'blur(3px)',
            },
          }}
        />
      </View>
      <View
        zIndex={3}
        position="absolute"
        align="center"
        insetTop={20}
        attributes={{
          style: {
            left: '50%',
            transform: 'translateX(-58%)',
          },
        }}
        gap={5}
      >
        <Text color="disabled" variant="title-4">
          Solvex Hotel Booking Manager
        </Text>
        <form onSubmit={handleSubmit(submitHandler)}>
          <View gap={4} width={80}>
            <FormControl hasError>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    placeholder="e-mail"
                    name={field.name}
                    value={field.value}
                    icon={User}
                    onChange={({ event }) => field.onChange(event)}
                    // inputAttributes={{
                    //   type: passwordView ? "text" : "password",
                    // }}
                    size="large"
                  />
                )}
              />
              <FormControl.Error>{errors?.email?.message}</FormControl.Error>
            </FormControl>
            <FormControl hasError>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    name={field.name}
                    placeholder="password"
                    value={field.value}
                    icon={Lock}
                    onChange={({ event }) => field.onChange(event)}
                    inputAttributes={{
                      type: passwordView ? 'text' : 'password',
                    }}
                    size="large"
                    endSlot={
                      <Button
                        size="small"
                        variant="ghost"
                        icon={passwordView ? EyeOff : Eye}
                        onClick={() => setPasswordView((oldState) => !oldState)}
                      />
                    }
                  />
                )}
              />
              <FormControl.Error>{errors.password?.message}</FormControl.Error>
            </FormControl>
            <Button type="submit" variant="solid" color="primary" size="medium" fullWidth>
              Log in
            </Button>
          </View>
        </form>
      </View>
    </View>
  );
};
export default UserLogin;
