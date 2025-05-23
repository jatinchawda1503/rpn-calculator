'use client';

import { useState, useEffect } from 'react';
import History from '@/components/History';
import { saveCalculation, fetchHistory, HistoryItem } from '@/api';

// Define the type for calculation results with operations
interface CalculationResult {
  result: number;
  operations?: Array<{
    operands: number[];
    operator: string;
    result: number;
  }>;
}


export default function Calculator({ onCalculationSuccess }: { onCalculationSuccess?: () => void }) {
  const [input, setInput] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [result, setResult] = useState<null | CalculationResult>(null);
  const [error, setError] = useState<null | string>(null);
  const [stack, setStack] = useState<string[]>([]);
  const [history, setHistory] = useState<string[][]>([]);  // For undo functionality
  const [calcHistory, setCalcHistory] = useState<{expression: string, result: number}[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [advancedMode, setAdvancedMode] = useState(false);

  // Map keyboard keys to calculator operations
  const keyMap: { [key: string]: string } = {
    '0': '0',
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '+': '+',
    '-': '-',
    '*': '*',
    '/': '/',
    '^': 'pow',
    '%': '%',
    '.': '.',
    'Enter': 'Enter',
    'Escape': 'clear',
    'Backspace': 'Backspace'
  };

  // Get the display values for the three rows
  const getDisplayValues = () => {
    // Bottom row (3rd row) shows current input or 0 if waiting for input
    const bottomValue = input !== '' ? input : '0';
    
    // Middle row (2nd row) shows top of stack or 0 if stack is empty
    const middleValue = stack.length > 0 ? stack[stack.length - 1] : '0';
    
    // Top row (1st row) shows second from top of stack or 0 if not enough items
    const topValue = stack.length > 1 ? stack[stack.length - 2] : '0';
    
    return { top: topValue, middle: middleValue, bottom: bottomValue };
  };

  const displayValues = getDisplayValues();

  const loadHistory = async () => {
    setIsHistoryLoading(true);
    setHistoryError(null);
    try {
      const data = await fetchHistory();
      setHistoryData(data);
    } catch (err) {
      console.error('Error fetching history:', err);
      setHistoryError('Failed to load calculation history');
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleCalculatorInput = (key: string) => {
    if (key === 'clear') {
      // Save current state for undo
      if (stack.length > 0) {
        setHistory(prev => [...prev, [...stack]]);
      }
      setInput('');
      setResult(null);
      setError(null);
      setStack([]);
    } else if (key === 'Backspace') {
      // Remove the last character from the input
      setInput(prev => prev.slice(0, -1));
    } else if (key === 'Swap') {
      // Swap the top two elements of the stack
      if (stack.length >= 2) {
        const newStack = [...stack];
        const temp = newStack[newStack.length - 1];
        newStack[newStack.length - 1] = newStack[newStack.length - 2];
        newStack[newStack.length - 2] = temp;
        
        // Save current state for undo
        setHistory(prev => [...prev, [...stack]]);
        setStack(newStack);
      } else {
        setError('Need at least two values to swap');
      }
    } else if (key === 'Undo') {
      // Restore previous stack state
      if (history.length > 0) {
        const prevState = history[history.length - 1];
        setStack(prevState);
        setHistory(prev => prev.slice(0, -1));
    } else {
        setError('Nothing to undo');
      }
    } else if (key === 'ToggleSign') {
      // Toggle the sign of the current input
      if (input) {
        if (input.startsWith('-')) {
          // Remove the negative sign
          setInput(input.substring(1));
        } else {
          // Add negative sign
          setInput('-' + input);
        }
      } else if (stack.length > 0) {
        // If no input but there's a value on the stack, toggle the sign of the top value
        const topValue = parseFloat(stack[stack.length - 1]);
        const newValue = -topValue;
        
        // Save current state for undo
        setHistory(prev => [...prev, [...stack]]);
        
        // Update stack with new value
        const newStack = [...stack.slice(0, -1), newValue.toString()];
        setStack(newStack);
      } else {
        setError('No value to toggle sign');
      }
    } else if (key === 'Enter') {
      // Only process if there's input
      if (input.trim()) {
        const numValue = parseFloat(input);
        if (!isNaN(numValue)) {
          // Save current state for undo
          setHistory(prev => [...prev, [...stack]]);
          
          // Add the new value to the existing stack (append it)
          setStack(prev => [...prev, numValue.toString()]);
          setInput(''); // Clear input after adding to stack
        } else {
          setError('Invalid number');
        }
      }
    } else if (['+', '-', '*', '/', 'pow', '%'].includes(key)) {
      // Process operations - we need two values, either from stack or input + stack
      let a: number, b: number;
      const newStack = [...stack];
      
      // If there's input, use it as the second operand
      if (input !== '') {
        try {
          b = parseFloat(input);
          if (isNaN(b)) throw new Error('Invalid input');
          
          // If stack has at least one value, use that as first operand
          if (stack.length > 0) {
            a = parseFloat(newStack.pop() || '0');
          } else {
            setError('Need at least one value on stack');
            return;
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Invalid input');
          return;
        }
      } else {
        // No input, so we need at least 2 values on stack
        if (stack.length < 2) {
          setError('Need at least two values for operation');
          return;
        }
        
        // Pop top two values from stack
        b = parseFloat(newStack.pop() || '0');
        a = parseFloat(newStack.pop() || '0');
      }

      // Save current state for undo
      setHistory(prev => [...prev, [...stack]]);
      
      let result = 0;
      let resultText = '';
      
      try {
        switch (key) {
          case '+': 
            result = a + b; 
            resultText = `${a} + ${b} = ${result}`;
            break;
          case '-': 
            result = a - b; 
            resultText = `${a} - ${b} = ${result}`;
            break;
          case '*': 
            result = a * b; 
            resultText = `${a} × ${b} = ${result}`;
            break;
          case '/': 
            if (b === 0) throw new Error('Division by zero');
            result = a / b; 
            resultText = `${a} ÷ ${b} = ${result}`;
            break;
          case 'pow': 
            result = Math.pow(a, b); 
            resultText = `${a}^${b} = ${result}`;
            break;
          case '%':
            if (b === 0) throw new Error('Modulo by zero');
            result = a % b;
            resultText = `${a} % ${b} = ${result}`;
            break;
        }
        
        // Save calculation history
        setCalcHistory(prev => [...prev, {
          expression: resultText,
          result
        }]);
        
        // Create a new stack with the result
        newStack.push(result.toString());
        setStack(newStack);
        setInput('');
        
        // Notify parent if a calculation was successful
        if (onCalculationSuccess) {
          onCalculationSuccess();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Calculation error');
      }
    } else if (['sqrt', 'sin', 'cos', 'tan', 'log', 'ln', '!', 'pi', 'e'].includes(key)) {
      // Process unary operations or constants
      let value: number;
      const newStack = [...stack];
      let resultText = '';
      
      // For constants
      if (key === 'pi') {
        value = Math.PI;
        resultText = `π = ${value}`;
        newStack.push(value.toString());
        setStack(newStack);
        setInput('');
        
        // Save calculation history
        setCalcHistory(prev => [...prev, {
          expression: resultText,
          result: value
        }]);
        return;
      }
      
      if (key === 'e') {
        value = Math.E;
        resultText = `e = ${value}`;
        newStack.push(value.toString());
        setStack(newStack);
        setInput('');
        
        // Save calculation history
        setCalcHistory(prev => [...prev, {
          expression: resultText,
          result: value
        }]);
        return;
      }
      
      // For other operations, we need one value from input or stack
      if (input !== '') {
        try {
          value = parseFloat(input);
          if (isNaN(value)) throw new Error('Invalid input');
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Invalid input');
          return;
        }
      } else {
        // No input, so we need at least 1 value on stack
        if (stack.length < 1) {
          setError('Need at least one value for operation');
          return;
        }
        
        // Pop value from stack
        value = parseFloat(newStack.pop() || '0');
      }
      
      // Save current state for undo
      setHistory(prev => [...prev, [...stack]]);
      
      let result = 0;
      
      try {
        switch (key) {
          case 'sqrt':
            if (value < 0) throw new Error('Cannot calculate square root of a negative number');
            result = Math.sqrt(value);
            resultText = `√${value} = ${result}`;
            break;
          case 'sin':
            // Convert to radians for JS Math functions
            result = Math.sin(value * (Math.PI / 180));
            resultText = `sin(${value}°) = ${result}`;
            break;
          case 'cos':
            result = Math.cos(value * (Math.PI / 180));
            resultText = `cos(${value}°) = ${result}`;
            break;
          case 'tan':
            result = Math.tan(value * (Math.PI / 180));
            resultText = `tan(${value}°) = ${result}`;
            break;
          case 'log':
            if (value <= 0) throw new Error('Cannot calculate logarithm of zero or negative number');
            result = Math.log10(value);
            resultText = `log(${value}) = ${result}`;
            break;
          case 'ln':
            if (value <= 0) throw new Error('Cannot calculate natural logarithm of zero or negative number');
            result = Math.log(value);
            resultText = `ln(${value}) = ${result}`;
            break;
          case '!':
            // Factorial implementation
            if (value < 0 || !Number.isInteger(value)) {
              throw new Error('Factorial is only defined for non-negative integers');
            }
            
            if (value > 170) {
              throw new Error('Value too large for factorial calculation');
            }
            
            if (value === 0 || value === 1) {
              result = 1;
            } else {
              result = 1;
              for (let i = 2; i <= value; i++) {
                result *= i;
              }
            }
            resultText = `${value}! = ${result}`;
            break;
        }
        
        // Save calculation history
        setCalcHistory(prev => [...prev, {
          expression: resultText,
          result
        }]);
        
        // Create a new stack with the result
        newStack.push(result.toString());
        setStack(newStack);
        setInput('');
        
        // Notify parent if a calculation was successful
        if (onCalculationSuccess) {
          onCalculationSuccess();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Calculation error');
      }
    } else {
      // Add the key to the input
      setInput(prev => prev + key);
    }
  };

  // Effect to save calculations to backend
  useEffect(() => {
    if (calcHistory.length > 0) {
      const lastCalc = calcHistory[calcHistory.length - 1];
      saveCalculation(lastCalc.expression, lastCalc.result)
        .catch(err => console.error('Failed to save calculation:', err));
    }
  }, [calcHistory]);

  // Handle history toggle
  const toggleHistory = () => {
    if (!showHistory) {
      loadHistory();
    }
    setShowHistory(!showHistory);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (keyMap[e.key]) {
        e.preventDefault();
        handleCalculatorInput(keyMap[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, stack]);

  // Clear error message
  const clearError = () => {
    setError(null);
  };

  // Auto-dismiss error message after 10 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 10000);
      
      // Clean up timer
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Toggle between basic and advanced mode
  const toggleMode = () => {
    setAdvancedMode(!advancedMode);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {showHistory ? (
        <div className="bg-gray-800 rounded-xl shadow-xl">
          <div className="flex justify-between items-center p-3 border-b border-gray-700">
            <div className="invisible">Placeholder</div>
            <button 
              onClick={toggleHistory}
              className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="calculator-height overflow-hidden">
            <History 
              history={historyData} 
              isLoading={isHistoryLoading} 
              error={historyError} 
            />
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl shadow-xl">
          <div className="flex justify-between items-center p-3 border-b border-gray-700">
            <button 
              onClick={toggleMode}
              className={`text-xs font-medium rounded-lg px-2 py-1 cursor-pointer ${advancedMode ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-200'}`}
            >
              {advancedMode ? 'Advanced' : 'Basic'}
            </button>
            <button 
              onClick={toggleHistory}
              className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          
          {/* Stack display - 3 rows */}
          <div className="p-3">
            {/* First row (top of stack) */}
            <div className="border-b border-gray-600 h-10 flex items-center justify-end pr-3 text-lg font-mono text-blue-300">
              {displayValues.top}
            </div>
            
            {/* Second row (middle of stack) */}
            <div className="border-b border-gray-600 h-10 flex items-center justify-end pr-3 text-lg font-mono text-blue-400">
              {displayValues.middle}
            </div>
            
            {/* Third row (bottom row - input or waiting for input) */}
            <div className="h-10 flex items-center justify-end pr-3 text-lg font-mono text-blue-500 font-bold">
              {displayValues.bottom}
            </div>
          </div>
          
          {/* Error display with close button */}
          {error && (
            <div className="mx-3 mb-3 p-2 text-xs text-red-400 bg-red-900 bg-opacity-30 rounded-lg relative">
              <div className="pr-6">{error}</div>
              <button 
                onClick={clearError}
                className="absolute top-1 right-1 text-red-400 hover:text-red-300 cursor-pointer"
                aria-label="Close error message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}

          {/* Calculator buttons - responsive sizing */}
          <div className="p-3 grid grid-cols-4 gap-1">
            {advancedMode ? (
              <>
                {/* Advanced Mode Buttons */}
                {/* Row 1: clear, undo, swap, / */}
                <button
                  onClick={() => handleCalculatorInput('clear')}
                  className="py-2 text-sm font-medium bg-red-600 text-white rounded-lg cursor-pointer"
                >
                  clear
                </button>
                <button
                  onClick={() => handleCalculatorInput('Undo')}
                  className="py-2 text-sm font-medium bg-amber-600 text-white rounded-lg cursor-pointer"
                >
                  undo
                </button>
                <button
                  onClick={() => handleCalculatorInput('Swap')}
                  className="py-2 text-sm font-medium bg-gray-600 text-white rounded-lg cursor-pointer"
                >
                  swap
                </button>
                <button
                  onClick={() => handleCalculatorInput('/')}
                  className="py-2 text-sm font-medium bg-gray-600 text-white rounded-lg cursor-pointer"
                >
                  /
                </button>
                
                {/* Row 2: sqrt, sin, cos, × */}
                <button
                  onClick={() => handleCalculatorInput('sqrt')}
                  className="py-2 text-sm font-medium bg-purple-600 text-white rounded-lg cursor-pointer"
                >
                  sqrt
                </button>
                <button
                  onClick={() => handleCalculatorInput('sin')}
                  className="py-2 text-sm font-medium bg-purple-600 text-white rounded-lg cursor-pointer"
                >
                  sin
                </button>
                <button
                  onClick={() => handleCalculatorInput('cos')}
                  className="py-2 text-sm font-medium bg-purple-600 text-white rounded-lg cursor-pointer"
                >
                  cos
                </button>
                <button
                  onClick={() => handleCalculatorInput('*')}
                  className="py-2 text-base font-medium bg-gray-600 text-white rounded-lg cursor-pointer"
                >
                  ×
                </button>
                
                {/* Row 3: tan, log, ln, - */}
                <button
                  onClick={() => handleCalculatorInput('tan')}
                  className="py-2 text-sm font-medium bg-purple-600 text-white rounded-lg cursor-pointer"
                >
                  tan
                </button>
                <button
                  onClick={() => handleCalculatorInput('log')}
                  className="py-2 text-sm font-medium bg-purple-600 text-white rounded-lg cursor-pointer"
                >
                  log
                </button>
                <button
                  onClick={() => handleCalculatorInput('ln')}
                  className="py-2 text-sm font-medium bg-purple-600 text-white rounded-lg cursor-pointer"
                >
                  ln
                </button>
                <button
                  onClick={() => handleCalculatorInput('-')}
                  className="py-2 text-base font-medium bg-gray-600 text-white rounded-lg cursor-pointer"
                >
                  -
                </button>
                
                {/* Row 4: pow, !, pi, + */}
                <button
                  onClick={() => handleCalculatorInput('pow')}
                  className="py-2 text-sm font-medium bg-gray-600 text-white rounded-lg cursor-pointer"
                >
                  x^y
                </button>
                <button
                  onClick={() => handleCalculatorInput('!')}
                  className="py-2 text-sm font-medium bg-purple-600 text-white rounded-lg cursor-pointer"
                >
                  !
                </button>
                <button
                  onClick={() => handleCalculatorInput('pi')}
                  className="py-2 text-sm font-medium bg-purple-600 text-white rounded-lg cursor-pointer"
                >
                  π
                </button>
                <button
                  onClick={() => handleCalculatorInput('+')}
                  className="py-2 text-base font-medium bg-gray-600 text-white rounded-lg cursor-pointer"
                >
                  +
                </button>
                
                {/* Row 5: 0, ., e, % */}
                <button
                  onClick={() => handleCalculatorInput('0')}
                  className="py-2 text-base font-medium bg-gray-700 text-white rounded-lg cursor-pointer"
                >
                  0
                </button>
                <button
                  onClick={() => handleCalculatorInput('.')}
                  className="py-2 text-base font-medium bg-gray-700 text-white rounded-lg cursor-pointer"
                >
                  .
                </button>
                <button
                  onClick={() => handleCalculatorInput('e')}
                  className="py-2 text-sm font-medium bg-purple-600 text-white rounded-lg cursor-pointer"
                >
                  e
                </button>
                <button
                  onClick={() => handleCalculatorInput('%')}
                  className="py-2 text-sm font-medium bg-gray-600 text-white rounded-lg cursor-pointer"
                >
                  %
                </button>
                
                {/* Row 6: +/-, Enter */}
                <button
                  onClick={() => handleCalculatorInput('ToggleSign')}
                  className="py-2 text-sm font-medium bg-teal-600 text-white rounded-lg cursor-pointer"
                >
                  +/-
                </button>
                <button
                  onClick={() => handleCalculatorInput('Enter')}
                  className="py-2 text-base font-medium bg-green-600 text-white rounded-lg col-span-3 cursor-pointer"
                >
                  enter
                </button>
              </>
            ) : (
              <>
                {/* Basic Mode Buttons */}
                {/* Row 1: clear, undo, swap, / */}
                <button
                  onClick={() => handleCalculatorInput('clear')}
                  className="py-2 text-sm font-medium bg-red-600 text-white rounded-lg cursor-pointer"
                >
                  clear
                </button>
                <button
                  onClick={() => handleCalculatorInput('Undo')}
                  className="py-2 text-sm font-medium bg-amber-600 text-white rounded-lg cursor-pointer"
                >
                  undo
                </button>
                <button
                  onClick={() => handleCalculatorInput('Swap')}
                  className="py-2 text-sm font-medium bg-gray-600 text-white rounded-lg cursor-pointer"
                >
                  swap
                </button>
                <button
                  onClick={() => handleCalculatorInput('/')}
                  className="py-2 text-sm font-medium bg-gray-600 text-white rounded-lg cursor-pointer"
                >
                  /
                </button>
                
                {/* Row 2: 7, 8, 9, × */}
                <button
                  onClick={() => handleCalculatorInput('7')}
                  className="py-2 text-base font-medium bg-gray-700 text-white rounded-lg cursor-pointer"
                >
                  7
                </button>
                <button
                  onClick={() => handleCalculatorInput('8')}
                  className="py-2 text-base font-medium bg-gray-700 text-white rounded-lg cursor-pointer"
                >
                  8
                </button>
                <button
                  onClick={() => handleCalculatorInput('9')}
                  className="py-2 text-base font-medium bg-gray-700 text-white rounded-lg cursor-pointer"
                >
                  9
                </button>
                <button
                  onClick={() => handleCalculatorInput('*')}
                  className="py-2 text-base font-medium bg-gray-600 text-white rounded-lg cursor-pointer"
                >
                  ×
                </button>
                
                {/* Row 3: 4, 5, 6, - */}
                <button
                  onClick={() => handleCalculatorInput('4')}
                  className="py-2 text-base font-medium bg-gray-700 text-white rounded-lg cursor-pointer"
                >
                  4
                </button>
                <button
                  onClick={() => handleCalculatorInput('5')}
                  className="py-2 text-base font-medium bg-gray-700 text-white rounded-lg cursor-pointer"
                >
                  5
                </button>
                <button
                  onClick={() => handleCalculatorInput('6')}
                  className="py-2 text-base font-medium bg-gray-700 text-white rounded-lg cursor-pointer"
                >
                  6
                </button>
                <button
                  onClick={() => handleCalculatorInput('-')}
                  className="py-2 text-base font-medium bg-gray-600 text-white rounded-lg cursor-pointer"
                >
                  -
                </button>
                
                {/* Row 4: 1, 2, 3, + */}
                <button
                  onClick={() => handleCalculatorInput('1')}
                  className="py-2 text-base font-medium bg-gray-700 text-white rounded-lg cursor-pointer"
                >
                  1
                </button>
                <button
                  onClick={() => handleCalculatorInput('2')}
                  className="py-2 text-base font-medium bg-gray-700 text-white rounded-lg cursor-pointer"
                >
                  2
                </button>
                <button
                  onClick={() => handleCalculatorInput('3')}
                  className="py-2 text-base font-medium bg-gray-700 text-white rounded-lg cursor-pointer"
                >
                  3
                </button>
                <button
                  onClick={() => handleCalculatorInput('+')}
                  className="py-2 text-base font-medium bg-gray-600 text-white rounded-lg cursor-pointer"
                >
                  +
                </button>
                
                {/* Row 5: 0, ., +/-, pow */}
                <button
                  onClick={() => handleCalculatorInput('0')}
                  className="py-2 text-base font-medium bg-gray-700 text-white rounded-lg cursor-pointer"
                >
                  0
                </button>
                <button
                  onClick={() => handleCalculatorInput('.')}
                  className="py-2 text-base font-medium bg-gray-700 text-white rounded-lg cursor-pointer"
                >
                  .
                </button>
                <button
                  onClick={() => handleCalculatorInput('ToggleSign')}
                  className="py-2 text-sm font-medium bg-teal-600 text-white rounded-lg cursor-pointer"
                >
                  +/-
                </button>
                <button
                  onClick={() => handleCalculatorInput('pow')}
                  className="py-2 text-sm font-medium bg-gray-600 text-white rounded-lg cursor-pointer"
                >
                  pow
                </button>
                
                {/* Row 6: Enter */}
                <button
                  onClick={() => handleCalculatorInput('Enter')}
                  className="py-2 text-base font-medium bg-green-600 text-white rounded-lg cursor-pointer col-span-4"
                >
                  enter
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}