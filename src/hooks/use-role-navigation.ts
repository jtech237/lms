'use client';
import { useSession } from 'next-auth/react';

export const useRoleNavigation = () => {
  const { data: session } = useSession();

  const basePath =
    session?.user?.role === 'TEACHER'
      ? '/dashboard/teacher'
      : session?.user?.role === 'ADMIN'
      ? '/dashboard/admin'
      : '/dashboard/student';

  return (path: string) => `${basePath}${path}`;
};
