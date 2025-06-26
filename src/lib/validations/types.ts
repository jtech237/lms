import { z } from 'zod';
import { registerSchema } from '@/lib/validations';

export type RegisterFormValues = z.infer<typeof registerSchema>;
