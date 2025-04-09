/**
 * Fetch calculation history
 */
// Types
export interface HistoryItem {
    id: number;
    expression: string;
    result: number;
    timestamp: string;
    operations?: Array<{
      operands: number[];
      operator: string;
      result: number;
    }>;
  }

export const fetchHistory = async (): Promise<HistoryItem[]> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/history`);
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      return await response.json();
    } catch (err) {
      console.error('Error fetching history:', err);
      throw err;
    }
  }; 