import { z } from 'zod';

export const registerSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().min(1, 'Le nom est requis'),
    email: z.string().email("L'adresse email n'est pas valide"),
    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%#*?&]{8,}$/,
        'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
      ),
    passwordConfirmation: z.string(),
    acceptTerms: z.boolean().refine((val) => val, {
      message: "Vous devez accepter les conditions d'utilisation",
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['passwordConfirmation'],
  });

export const createUserSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  email: z.string(),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%#*?&]{8,}$/,
      'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
    ),
  acceptTerms: z.boolean().refine((val) => val, {
    message: "Vous devez accepter les conditions d'utilisation",
  }),
});
