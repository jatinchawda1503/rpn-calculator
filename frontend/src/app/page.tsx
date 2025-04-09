'use client';

import Calculator from '@/components/Calculator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 overflow-y-auto pb-20">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-md">
          <Calculator />
        </div>
      </div>
    </main>
  );
}