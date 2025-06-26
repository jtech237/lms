import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email requis').email('Adresse email invalide'),
  password: z.string().min(1, 'Ce champ est requis'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
