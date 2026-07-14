'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', { 
      ...Object.fromEntries(formData),
      redirectTo: '/?login=success'
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function register(
  prevState: string | undefined,
  formData: FormData,
) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return 'Missing required fields.';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters.';
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return 'Email already in use.';
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Automatically sign in after successful registration
    // This is optional, but convenient
  } catch (error) {
    console.error('Failed to register user:', error);
    return 'Failed to register.';
  }

  redirect('/login');
}

export async function logout() {
  await signOut();
}
