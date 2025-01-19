
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { User } from '../interfaces/user.interface';
import parseCookie from '../utils/parseCookie';
import userService from '../services/user'


interface AuthContextType {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const token = parseCookie("parser-token");
    if (token) {
      userService.verify(token).then((r) => {
        setUser(r);
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }
    }>
      {children}
    </AuthContext.Provider>

  );
}

