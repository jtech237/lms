import { NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/logger';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export default function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        message: error.message,
        code: error.code,
        status: 'error',
      },
      { status: error.status }
    );
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Données invalides',
        errors: error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      },
      { status: 400 }
    );
  }

  logger.error('Erreur non gérée:', error);
  return NextResponse.json(
    {
      status: 'error',
      message: 'Une erreur interne est survenue',
      code: 'INTERNAL_SERVER_ERROR',
    },
    { status: 500 }
  );
}
