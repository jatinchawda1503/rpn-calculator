'use client';

import { useState } from 'react';
import Calculator from '@/components/Calculator';
import CSVUpload from '@/components/CSVUpload';
import SupportedOperationsComponent from '@/components/SupportedOperations';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'csv' | 'operations'>('calculator');

  return (
    <main className="min-h-screen bg-gray-900 overflow-y-auto pb-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-white mb-8">RPN Calculator</h1>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button 
              onClick={() => setActiveTab('calculator')} 
              className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                activeTab === 'calculator'
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600'
              }`}
            >
              Calculator
            </button>
            <button 
              onClick={() => setActiveTab('csv')} 
              className={`px-4 py-2 text-sm font-medium border-t border-b ${
                activeTab === 'csv'
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600'
              }`}
            >
              CSV Upload
            </button>
            <button 
              onClick={() => setActiveTab('operations')} 
              className={`px-4 py-2 text-sm font-medium rounded-r-md border ${
                activeTab === 'operations'
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600'
              }`}
            >
              Supported Operations
            </button>
          </div>
        </div>
        
        {/* Content based on active tab */}
        <div className="flex justify-center">
          {activeTab === 'calculator' && (
            <div className="w-full max-w-md">
              <Calculator />
            </div>
          )}
          
          {activeTab === 'csv' && (
            <div className="w-full max-w-md">
              <CSVUpload />
            </div>
          )}
          
          {activeTab === 'operations' && (
            <div className="w-full max-w-md">
              <SupportedOperationsComponent />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}