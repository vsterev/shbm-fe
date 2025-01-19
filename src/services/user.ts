import { AddUser, EditUser, GetUser, User } from '../interfaces/user.interface';
import { unauthorizedHandle } from '../utils/unauthorizadHandle';
import config from './config';

const Users = {
  login: async (data: { email: string, password: string }) => {
    try {
      const res = await fetch(`${config.backEndUrl}/user/login`, {
        body: JSON.stringify(data),
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
      });
      if (res.status === 401) {
        return { err: 'authentiction error' }
      }
      return await res.json();
    } catch (e) {
      console.error(e)
    }
  },
  verify: async (token: string): Promise<User | undefined> => {
    try {
      const res = await fetch(`${config.backEndUrl}/user/verify`, {
        method: 'GET',
        headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      });
      return await res.json() as User;
    } catch (e) {
      console.error(e);
    }
  },
  // logout: async (token: string): Promise<void> => {
  //   return fetch(`${config.backEndUrl}/user/logout`, {
  //     method: 'GET',
  //     headers: { 'Content-type': 'application/json', Authorization: token },
  //   })
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .catch((e) => console.error(e));
  // },
  allUsers: async (token: string): Promise<GetUser[]> => {
    try {
      const res = await fetch(`${config.backEndUrl}/user/users`, {
        method: 'GET',
        headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      });
      return await unauthorizedHandle(res) || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  delete: async (data: { _id: string }, token: string) => {
    try {
      const res = await fetch(`${config.backEndUrl}/user`, {
        body: JSON.stringify(data),
        method: 'DELETE',
        headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch (e) {
      console.error(e);
      return;
    }
  },
  register: async (data: Omit<AddUser, "repass">, token: string) => {
    try {
      const res = await fetch(`${config.backEndUrl}/user`, {
        body: JSON.stringify(data),
        method: 'POST',
        headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      });
      return await unauthorizedHandle(res);
    } catch (e) {
      console.error(e);
      return;
    }
  },
  edit: async (user: EditUser, token: string) => {
    try {
      const res = await fetch(`${config.backEndUrl}/user`, {
        body: JSON.stringify(user),
        method: 'PATCH',
        headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      });
      return await unauthorizedHandle(res);
    } catch (e) {
      console.error(e);
      return;
    }
  },
};
export default Users;
