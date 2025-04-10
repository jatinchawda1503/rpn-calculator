/**
 * API functions for calculator operations
 */



/**
 * Save a calculation to the backend
 */
export const saveCalculation = async (expression: string, result: number): Promise<void> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expression: expression,
        result: result,
        user_id: 'user1',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save calculation');
    }
  } catch (err) {
    console.error('Error saving calculation:', err);
    throw err;
  }
};

/**
 * Upload a CSV file with expressions to calculate
 */
export interface CSVUploadResult {
  success: boolean;
  results: Array<{
    expression: string;
    result?: number;
    error?: string;
  }>;
}

export const uploadCSV = async (file: File): Promise<CSVUploadResult> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', 'user1');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload-csv`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload CSV file');
    }

    return await response.json();
  } catch (err) {
    console.error('Error uploading CSV file:', err);
    throw err;
  }
};

/**
 * Get a list of all supported operations
 */
export interface SupportedOperations {
  basic_operators: string[];
  functions: string[];
  constants: string[];
}

export const getSupportedOperations = async (): Promise<SupportedOperations> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/supported-operations`);
    
    if (!response.ok) {
      throw new Error('Failed to get supported operations');
    }

    return await response.json();
  } catch (err) {
    console.error('Error getting supported operations:', err);
    throw err;
  }
};

