export interface AddUser {
  isAdmin: boolean;
  name: string;
  email: string;
  password: string;
  repass?: string;
}

export interface EditUser {
  _id: string;
  isAdmin: boolean;
  name?: string;
  email?: string;
  password?: string;
  repass?: string;
}

export interface GetUser {
  _id: string;
  isAdmin: boolean;
  name: string;
  email: string;
  password: string;
}

export interface User {
  userId: string;
  name: string;
  email: string;
  isAdmin: boolean;
}
