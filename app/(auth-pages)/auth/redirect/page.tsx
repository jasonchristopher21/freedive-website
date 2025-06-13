'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const checkStatus = async () => {
      const res = await fetch('/api/user/status');
      const { redirect } = await res.json();
      router.replace(redirect);
    };
    checkStatus();
  }, [router]);

  return <p>Redirecting...</p>;
}
