'use client';

import { Loader2 } from 'lucide-react';

export const FullScreenSpinner = () => {
  return (
    <div className="flex items-center min-h-screen justify-center">
      <Loader2 className="animate-spin h-10 w-10 text-primary" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};
