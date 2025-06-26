import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginFormWrapper() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <LoginForm />
    </Suspense>
  );
}