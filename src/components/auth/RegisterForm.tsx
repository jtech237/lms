'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { registerSchema } from '@/lib/validations';
import { RegisterFormValues } from '@/lib/validations/types';
import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ApiError {
  errors?: Array<{ field: string; message: string }>;
  message?: string;
}

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      acceptTerms: false,
    },
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          name: `${data.firstName} ${data.lastName}`,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (result.errors) {
          throw { errors: result.errors };
        }
        throw new Error(result.message || 'Une erreur est survenue');
      }
      // toast.success('Votre compte a été créé avec succès! Veuillez vérifier votre email.')
      toast.success(
        'Votre compte a été créé avec succès! Vous serez redirige vers la page de connexion.',
      );

      router.push('/auth/login');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);

      // Gestion des erreurs de validation de l'API
      if (isApiError(error) && error.errors) {
        error.errors.forEach((err: { field: string; message: string }) => {
          form.setError(err.field as keyof RegisterFormValues, {
            type: 'manual',
            message: err.message,
          });
        });
        toast('Veuillez corriger les erreurs dans le formulaire.');
      } else {
        const message = (error as Error)?.message || 'Une erreur est survenue lors de l\'inscription';
        toast(message);
        form.setError('root', {
          type: 'manual',
          message,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isApiError = (error: unknown): error is ApiError => {
    return typeof error === 'object' && error !== null && ('errors' in error || 'message' in error);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="sign-up-form"
          className="space-y-6"
        >
          {/*Nom et prenom*/}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Prenom</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Jean"
                      autoComplete={'given-name'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={'Dupont'}
                      autoComplete={'family-name'}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/*  Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="email"
                    required
                    placeholder={'jean.dupont@example.fr'}
                  />
                </FormControl>
                <FormDescription>
                  Nous ne partagerons jamais votre email
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/*  Mot de passe */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={'new-password'}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/*  Confirmation du mot de passe */}
          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Termes */}
          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    required
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    {'J\'accepte les conditions d\'utilisation'}
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.formState.errors.root && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.root.message}
            </p>
          )}

          <div className="space-y-4">
            <Button
              type="submit"
              className={cn(
                isSubmitting ? 'cursor-progress' : 'cursor-pointer',
                'w-full',
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Inscription...
                </>
              ) : (
                'S\'inscrire'
              )}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou continuez avec
                </span>
              </div>
            </div>
            <Button variant="outline" type="button" className="w-full">
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              {'S\'inscrire avec Google'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
