// components/auth/LegalNotice.tsx
import Link from 'next/link';

export const LegalNotice = () => {
  return (
    <p className="text-muted-foreground">
      En vous inscrivant, vous acceptez nos{' '}
      <Link href="/terms" className="text-primary hover:underline">
        {"conditions d'utilisation"}
      </Link>{' '}
      et notre{' '}
      <Link href="/privacy" className="text-primary hover:underline">
        politique de confidentialité
      </Link>
      .
    </p>
  );
};
