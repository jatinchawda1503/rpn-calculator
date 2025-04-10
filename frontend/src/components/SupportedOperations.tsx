'use client';

import { useState, useEffect } from 'react';
import { getSupportedOperations, SupportedOperations } from '@/api/calculatorApi';

export default function SupportedOperationsComponent() {
  const [operations, setOperations] = useState<SupportedOperations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOperations = async () => {
      try {
        setIsLoading(true);
        const data = await getSupportedOperations();
        setOperations(data);
        setError(null);
      } catch (err) {
        setError('Failed to load supported operations');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOperations();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto bg-gray-800 rounded-xl shadow-xl p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !operations) {
    return (
      <div className="w-full max-w-md mx-auto bg-gray-800 rounded-xl shadow-xl p-4">
        <div className="p-3 text-red-400 bg-red-900 bg-opacity-30 rounded-lg">
          {error || 'Failed to load operations. Please try again later.'}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-gray-800 rounded-xl shadow-xl p-4">
      <h2 className="text-xl font-bold text-white mb-4">Supported Operations</h2>

      <div className="space-y-4">
        {/* Basic Operators Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Basic Operators</h3>
          <div className="grid grid-cols-4 gap-2">
            {operations.basic_operators.map((op) => (
              <div key={op} className="bg-gray-700 rounded-lg p-2 text-center">
                <span className="font-mono text-lg text-gray-200">{op}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Functions Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Functions</h3>
          <div className="grid grid-cols-3 gap-2">
            {operations.functions.map((func) => (
              <div key={func} className="bg-purple-700 rounded-lg p-2 text-center">
                <span className="font-mono text-lg text-gray-200">{func}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Constants Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Constants</h3>
          <div className="grid grid-cols-4 gap-2">
            {operations.constants.map((constant) => (
              <div key={constant} className="bg-teal-700 rounded-lg p-2 text-center">
                <span className="font-mono text-lg text-gray-200">{constant}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-700 rounded-lg">
        <h3 className="text-md font-semibold text-white mb-2">How to Use in RPN</h3>
        <ul className="text-sm text-gray-300 list-disc pl-5 space-y-1">
          <li>Enter values first, then apply operators: <code className="bg-gray-600 px-1 rounded">3 4 +</code></li>
          <li>For functions, enter value then apply: <code className="bg-gray-600 px-1 rounded">9 sqrt</code></li>
          <li>Constants can be used directly: <code className="bg-gray-600 px-1 rounded">pi 2 *</code></li>
        </ul>
      </div>
    </div>
  );
} 