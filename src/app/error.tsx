'use client';

import Error500 from '@/components/Error500';

const GlobalError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  console.error('Global Error:', error);
  return <Error500 reset={reset} />;
};

export default GlobalError;
