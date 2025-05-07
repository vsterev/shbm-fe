import { z } from 'zod';

export const userSchema = (isNew: boolean) => {
  return z
    .object({
      _id: z.string().optional(),
      email: z.string().email({ message: 'Invalid email' }),
      name: z.string().min(5, { message: 'Name is required must be at least 5 characters' }),
      password: isNew
        ? z.string().min(6, { message: 'Password must be at least 6 characters long' })
        : z.string().optional(),
      repass: z.string().optional(),
      isAdmin: z.boolean(),
    })
    .refine((data) => !data.password || data.password === data.repass, {
      message: 'Passwords do not match',
      path: ['repass'],
    })
    .refine((data) => !data.password || data.password?.length >= 6, {
      message: 'Password must be at least 6 characters long',
      path: ['password'],
    });
};

export type UserFormData = z.infer<ReturnType<typeof userSchema>>;
