/* eslint-disable react-refresh/only-export-components */
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { User } from '../interfaces/user.interface';
import appCookie from '../utils/appCookie';
import userService from '../services/user';
import { Loader, View } from 'reshaped';

interface AuthContextType {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

const AuthContext = createContext<AuthContextType | undefined | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | undefined>(undefined);

  const token = appCookie('hbs-token');
  useEffect(() => {
    setUser(undefined);
    userService.verify(token).then((r) => {
      setUser(r);
    });
  }, [token]);

  return (
    <>
      {user === undefined ? (
        <View paddingTop={20} width="100%" align="center">
          <Loader size="large" />
        </View>
      ) : (
        <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
      )}
    </>
  );
};
