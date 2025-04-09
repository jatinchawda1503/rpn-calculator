'use client';

import { useState } from 'react';
import { HistoryItem } from '@/api';

interface HistoryProps {
  history: HistoryItem[];
  isLoading: boolean;
  error: string | null;
  onRefresh?: () => void;
}

export default function History({ history, isLoading, error }: HistoryProps) {
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="p-3 h-full">      
      {error && (
        <div className="mb-3 p-2 text-xs text-red-400 bg-red-900 bg-opacity-30 rounded-lg">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : history.length === 0 ? (
        <div className="py-6 text-center text-gray-400">
          No calculation history found
        </div>
      ) : (
        <div className="h-[calc(100%-1.5rem)] overflow-y-auto pr-1 scrollbar-thin">
          {/* History items in calculator-like display */}
          <div className="space-y-2">
            {history.map((item) => (
              <div 
                key={item.id} 
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedItem?.id === item.id 
                    ? 'bg-gray-700 border border-blue-500' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setSelectedItem(item === selectedItem ? null : item)}
              >
                {/* Calculator-like display */}
                <div className="grid grid-cols-1 gap-1">
                  <div className="border-b border-gray-600 h-10 flex items-center justify-end pr-3 text-base font-mono text-blue-300">
                    {item.expression}
                  </div>
                  <div className="h-10 flex items-center justify-end pr-3 text-lg font-mono text-blue-500 font-bold">
                    {item.result}
                  </div>
                </div>
                
                <div className="mt-2 flex justify-between items-center text-xs text-gray-400">
                  <span>{formatDate(item.timestamp)}</span>
                </div>
                
                {/* Show operations if expanded and available */}
                {selectedItem?.id === item.id && item.operations && item.operations.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-gray-600">
                    <h4 className="text-xs font-semibold text-gray-300 mb-1">Operations:</h4>
                    <div className="grid grid-cols-1 gap-1 mt-1">
                      {item.operations.map((op, index) => (
                        <div key={index} className="text-xs text-gray-300 bg-gray-800 rounded p-2 flex justify-between">
                          <span>
                            {op.operands.length === 1 
                              ? `${op.operator}(${op.operands[0]})`
                              : `${op.operands[0]} ${op.operator} ${op.operands[1]}`
                            }
                          </span>
                          <span className="font-mono text-blue-400">{op.result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}