import { NextResponse } from 'next/server';
import { AuthError, CredentialsSignin } from 'next-auth';
import { ZodError } from 'zod';

export class AuthenticationError extends CredentialsSignin {
  constructor(message: string, code: string = 'CredentialsSignin') {
    super();
    this.message = message;
    this.code = code;
  }
}

export class UserNotFoundError extends AuthenticationError {
  constructor(message = "Aucun compte n'est associé à cette adresse email") {
    super(message, 'UserNotFound');
  }
}

export class InvalidCredentialsError extends AuthenticationError {
  constructor(message = 'Email ou mot de passe incorrect') {
    super(message, 'InvalidCredentials');
  }
}

export class MissingCredentialsError extends AuthenticationError {
  constructor(message = 'Veuillez fournir un email et un mot de passe') {
    super(message, 'MissingCredentials');
  }
}

export class ValidationError extends AuthenticationError {
  constructor(message = "Données d'entrée invalides") {
    super(message, 'ValidationError');
  }
}

export class DefaultError extends AuthenticationError {
  constructor(message = "Une erreur inattendue s'est produite") {
    super(message, 'Default');
  }
}

const errorMessages = {
  UserNotFound: {
    message: "Aucun compte n'est associé à cette adresse email",
    status: 401,
  },
  InvalidCredentials: {
    message: 'Email ou mot de passe incorrect',
    status: 401,
  },
  MissingCredentials: {
    message: 'Veuillez fournir un email et un mot de passe',
    status: 400,
  },
  ValidationError: {
    message: "Données d'entrée invalides",
    status: 400,
  },
  Default: {
    message: "Une erreur inattendue s'est produite",
    status: 500,
  },
} as const;

export const handleAuthError = (error: unknown): NextResponse => {
  const defaultError = errorMessages.Default;

  // Gestion des erreurs d'authentification personnalisées
  if (error instanceof AuthenticationError) {
    return NextResponse.json(
      {
        error: error.message,
        type: error.type || 'CredentialsSignin',
        kind: 'signIn',
        code: error.code,
      },
      {
        status:
          errorMessages[error.code as keyof typeof errorMessages]?.status ||
          401,
      }
    );
  }

  // Gestion des erreurs NextAuth
  if (error instanceof AuthError) {
    const errorInfo =
      errorMessages[error.type as keyof typeof errorMessages] || defaultError;
    return NextResponse.json(
      {
        error: errorInfo.message,
        type: error.type,
        kind: 'signIn',
        code: error.type,
      },
      { status: errorInfo.status }
    );
  }

  // Gestion des erreurs de validation Zod
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: error.errors.map((err) => err.message).join(', '),
        type: 'ValidationError',
        kind: 'signIn',
        code: 'ValidationError',
      },
      { status: 400 }
    );
  }

  // Gestion des erreurs par défaut
  return NextResponse.json(
    {
      error: defaultError.message,
      type: 'Default',
      kind: 'signIn',
      code: 'Default',
    },
    { status: defaultError.status }
  );
};
