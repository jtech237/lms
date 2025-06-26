import { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { AuthCard } from '@/components/auth/AuthCard';
import Link from 'next/link';
import { LegalNotice } from '@/components/auth/LegalNotice';

export const metadata: Metadata = {
  title: 'Inscription | LMS',
  description: 'Inscription',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <AuthCard
          title="Créer un compte"
          description="Inscrivez-vous pour accéder à notre plateforme"
          form={<RegisterForm />}
          footer={
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Déjà un compte ? </span>
              <Link href="/auth/login" className="text-primary hover:underline">
                Se connecter
              </Link>
            </div>
          }
          legal={<LegalNotice />}
        />
      </div>
    </div>
  );
}