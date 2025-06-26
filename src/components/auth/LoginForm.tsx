'use client';

import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type LoginFormValues, loginSchema } from '@/lib/validations';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });
  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    try {
      setIsSubmitting(true);
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      console.log(result);
      if (result.error) {
        toast.error('Erreur de connexion');
        switch (result.code) {
          case 'ValidationError':
            form.setError('root', {
              type: 'manual',
              message: 'Email ou mot de passe invalides. Verifiez vos donnees!',
            });
            // form.setFocus('email');
            break;
          case 'UserNotFound':
            form.setError('email', {
              type: 'value',
              message: "Aucun compte n'est associé à cette adresse email",
            });
            // form.setFocus('email');
            break;
          case 'InvalidCredentials':
            form.setError('root', {
              type: 'manual',
              message: 'Email ou mot de passe invalides. Verifiez vos donnees!',
            });
            break;
          case 'MissingCredentials':
            form.setError('root', {
              type: 'manual',
              message: 'Veuillez fournir un email et un mot de passe',
            });
            break;
          default:
            form.setError('root', {
              type: 'manual',
              message: "Une erreur inattendue s'est produite",
            });
            break;
        }
        console.log(form.formState.errors);
        return;
      }
      router.push(searchParams.get('next') || '/');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  return (
    <Form {...form}>
      <form
        id="login-form"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name={'email'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="votre@email.com"
                  type="email"
                  autoComplete="email"
                  {...field}
                  className="focus:ring-2 focus:ring-indigo-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel htmlFor="sign-in-password">Mot de passe</FormLabel>
                <Link
                  href="/mot-de-passe-oublie"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    id="sign-in-password"
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={togglePasswordVisibility}
                    aria-label={
                      showPassword
                        ? 'Masquer le mot de passe'
                        : 'Afficher le mot de passe'
                    }
                    aria-pressed={showPassword}
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

        {form.formState.errors.root && (
          <p className="text-sm font-medium text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}

        <div className="space-y-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion...
              </>
            ) : (
              'Se connecter'
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

          <Button
            variant="outline"
            type="button"
            className="w-full"
            // onClick={googleLogin}
          >
            <GoogleIcon className="mr-2 h-4 w-4" />
            Se connecter avec Google
          </Button>
        </div>
      </form>
    </Form>
  );
};

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 488 512"
  >
    <path
      fill="currentColor"
      d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
    />
  </svg>
);
