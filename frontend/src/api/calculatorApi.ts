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

