'use client';

import { useEffect, useState } from 'react';

export default function LoadingPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 border-4 border-maroon border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[#6B6B6B] text-sm">Loading...</p>
      </div>
    </div>
  );
}
