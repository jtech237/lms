import { NextRequest, NextResponse } from 'next/server';
import { createUserSchema } from '@/lib/validations';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import handleApiError, { ApiError } from '@/lib/api/error-handler';
import { logger } from '@/lib/logger';
import { Prisma } from '@/generated/prisma';

const saltRounds = process.env.NODE_ENV === 'production' ? 12 : 10;
const POST = async (req: NextRequest) => {
  try {
    const contentType = req.headers.get('Content-Type');
    if (!contentType?.includes('application/json')) {
      throw new ApiError('Content-Type must be application/json', 415);
    }

    const body = await req.json().catch(() => {
      throw new ApiError('Invalid JSON body', 400);
    });

    const validationResult = await createUserSchema.safeParseAsync(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          status: 'error',
          errors: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 },
      );
    }
    const { name, email, password } = validationResult.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      throw new ApiError(
        'Un compte existe déjà avec cette adresse email',
        409,
        'EMAIL_EXISTS',
      );
    }


// Hashage du mot de passe
    const salt = await bcrypt.genSalt(saltRounds).catch((e) => {
      logger.error('Erreur lors de la generation du salt pour le mot de passe:', e)
      throw new ApiError('Erreur lors de la création du compte', 500)
    })
    const passwordHash = await bcrypt.hash(password, salt).catch((err) => {
      logger.error('Erreur lors du hashage du mot de passe:', err);
      throw new ApiError('Erreur lors de la création du compte', 500);
    });

    const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: 'STUDENT',
          emailVerified: null,
          updatedAt: new Date()
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      }).catch((error) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ApiError('Cette adresse email est déjà utilisée', 409);
          }
        }
        logger.error('Erreur lors de la création de l\'utilisateur:', error);
        throw new ApiError('Erreur lors de la création du compte', 500);
      })
    ;
    // Envoi d'email de vérification (à implémenter)
    try {
      await sendVerificationEmail(String(user.email));
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de l\'email de vérification:', error);
      // On continue malgré l'erreur d'envoi d'email
    }

    return NextResponse.json({
      status: 'success',
      message: 'Compte créé avec succès',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    }, {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });


  } catch (err) {
    return handleApiError(err);
  }
};

// Fonction d'envoi d'email de vérification
async function sendVerificationEmail(email: string) {
  // Implémentation de l'envoi d'email de vérification
  // À implémenter selon votre logique d'envoi d'emails
  logger.info(`TODO: Implement email send`, email)
}

// Types pour les réponses API
export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}


export { POST };