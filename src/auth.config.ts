import { type DefaultSession, NextAuthConfig } from 'next-auth';
import Credentials from '@auth/core/providers/credentials';
import { z } from 'zod';
import {
  InvalidCredentialsError, UserNotFoundError,
  ValidationError,
} from '@/lib/auth/error';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs'

type UserRoleType = 'TEACHER' | 'ADMIN' | 'STUDENT';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRoleType;
    } & DefaultSession['user'];
  }

  interface User {
    role: UserRoleType;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string
    role: UserRoleType
  }
}

const credentialsSchema = z.object({
  email: z.string().email('Veuillez entrer une adresse email valide.'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit avoir au moins 8 caracteres'),
});

export default {
  providers: [
    Credentials({
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'johndoe@gmail.com',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: '********',
        },
      },
      authorize: async (credentials) => {
        let user = null;
        try {
          const { email, password } = await credentialsSchema.parseAsync(
            credentials
          );
          user = await prisma.user.findUnique({where: {email}})
          if (!user || !user.passwordHash){
            throw new UserNotFoundError("Utilisateur invalide.")
          }

          const {passwordHash, ...safe} = user

          const isValid = await bcrypt.compare(password, passwordHash)
          if (!isValid){
            throw new InvalidCredentialsError()
          }

          return safe;
        } catch (e) {
          logger.error('Erreur lors de la connexion:', e);
          if (e instanceof z.ZodError) {
            throw new ValidationError(
              e.errors.map((err) => err.message).join(', ')
            );
          }

          throw e;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
    // error: '/auth/error',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = user.role;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;
