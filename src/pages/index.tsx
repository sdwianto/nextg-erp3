import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLoader from '@/components/ui/dashboard-loader';

export default function IndexPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
      void router.replace('/dashboard');
    }, 2000); // Show loader for 2 seconds

    return () => clearTimeout(timer);
  }, [router]);

  if (isLoading) {
    return <DashboardLoader variant="fullscreen" />;
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">NextGen ERP</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Redirecting to dashboard...</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    </div>
  );
} 