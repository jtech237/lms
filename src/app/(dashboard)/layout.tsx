import React, { Suspense } from 'react';

import { FullScreenSpinner } from '@/components/loading';
import { DashboardContent } from '../dashboard-content';

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (
    <Suspense fallback={<FullScreenSpinner />}>
      <DashboardContent>
        {children}
      </DashboardContent>
    </Suspense>
  );
}
