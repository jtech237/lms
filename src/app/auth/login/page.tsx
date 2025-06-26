import { Metadata } from 'next';
import Link from 'next/link';
import { AuthCard } from '@/components/auth/AuthCard';
import { LegalNotice } from '@/components/auth/LegalNotice';
import LoginFormWrapper from '@/components/auth/LoginFormWrapper';

export const metadata: Metadata = {
  title: 'Connexion - JTECH LMS',
  description: 'Accedez a vitre compte pour suivre vos cours en ligne',
};

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex flex-col justify-center md:py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <AuthCard
          title="Connexion à votre compte"

          description="Entrez vos identifiants pour accéder à votre espace"
          form={<LoginFormWrapper />}
          footer={
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Pas encore de compte ? </span>
              <Link href="/auth/register" className="text-primary hover:underline">
                {'S\'inscrire'}
              </Link>
            </div>
          }
          legal={<LegalNotice />} />
      </div>
    </div>
  );
}