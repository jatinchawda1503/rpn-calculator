'use client';

import { useState } from 'react';
import { uploadCSV, CSVUploadResult } from '@/api/calculatorApi';

// Sample RPN expressions for the downloadable CSV
const SAMPLE_EXPRESSIONS = [
  '3 4 +',
  '5 6 + 2 *',
  '10 3 -',
  '8 2 /',
  '2 3 ^',
  '9 sqrt',
  '45 sin',
  'pi 2 *',
  'e 1 +',
  '5 !'
];

export default function CSVUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<CSVUploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Reset states when a new file is selected
      setFile(e.target.files[0]);
      setUploadResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    // Check file extension
    if (!file.name.endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      
      const result = await uploadCSV(file);
      setUploadResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
      setUploadResult(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Function to generate and download a sample CSV file
  const downloadSampleCSV = () => {
    // Create CSV content from sample expressions
    const csvContent = SAMPLE_EXPRESSIONS.join('\n');
    
    // Create a blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'rpn_sample_expressions.csv');
    link.style.display = 'none';
    
    // Add the link to the body, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up by revoking the object URL
    URL.revokeObjectURL(url);
  };

  // Function to export calculation results to a CSV file
  const exportResultsToCSV = () => {
    if (!uploadResult || uploadResult.results.length === 0) return;

    // Create header row
    const header = "Expression,Result,Error\n";
    
    // Create rows for each result
    const rows = uploadResult.results.map(item => {
      const expression = item.expression.replace(/,/g, " "); // Replace commas in expressions
      const result = item.error ? "" : String(item.result);
      const error = item.error || "";
      return `"${expression}","${result}","${error}"`;
    }).join('\n');
    
    // Combine header and rows
    const csvContent = header + rows;
    
    // Create a blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'rpn_calculation_results.csv');
    link.style.display = 'none';
    
    // Add the link to the body, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up by revoking the object URL
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-800 rounded-xl shadow-xl p-4">
      <h2 className="text-xl font-bold text-white mb-4">CSV Expression Upload</h2>
      
      <div className="mb-4">
        <p className="text-gray-300 text-sm mb-2">
          Upload a CSV file with RPN expressions to calculate. Each row should contain one expression.
        </p>
        <p className="text-gray-400 text-sm mb-2">
          Example: <code>3 4 +</code>, <code>5 6 + 2 *</code>
        </p>
        
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={downloadSampleCSV}
            className="py-2 px-3 text-xs font-medium bg-teal-600 hover:bg-teal-500 text-white rounded-lg cursor-pointer flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Sample CSV
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="relative cursor-pointer bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg text-gray-100 flex-grow">
            <span className="truncate block">
              {file ? file.name : 'Choose CSV file'}
            </span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
          
          <button 
            onClick={handleUpload}
            disabled={isUploading || !file}
            className={`py-2 px-4 rounded-lg ${
              isUploading 
                ? 'bg-blue-700 cursor-not-allowed' 
                : file 
                  ? 'bg-blue-600 hover:bg-blue-500 cursor-pointer' 
                  : 'bg-blue-800 cursor-not-allowed'
            } text-white`}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
        
        {error && (
          <div className="mt-2 p-2 text-xs text-red-400 bg-red-900 bg-opacity-30 rounded-lg">
            {error}
          </div>
        )}
      </div>
      
      {uploadResult && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-white">Results</h3>
            <button
              onClick={exportResultsToCSV}
              className="py-1.5 px-3 text-xs font-medium bg-green-600 hover:bg-green-500 text-white rounded-lg cursor-pointer flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Export Results
            </button>
          </div>
          
          <div className="bg-gray-700 rounded-lg max-h-60 overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase bg-gray-600 text-gray-300 sticky top-0">
                <tr>
                  <th className="px-3 py-2">Expression</th>
                  <th className="px-3 py-2">Result</th>
                </tr>
              </thead>
              <tbody>
                {uploadResult.results.map((item, index) => (
                  <tr key={index} className="border-b border-gray-600">
                    <td className="px-3 py-2 font-mono">{item.expression}</td>
                    <td className="px-3 py-2 font-mono">
                      {item.error ? (
                        <span className="text-red-400">{item.error}</span>
                      ) : (
                        <span className="text-green-400">{item.result}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-2 text-sm text-gray-400">
            {uploadResult.results.length} expressions processed
          </div>
        </div>
      )}
      
      {/* Instructions for using the sample CSV */}
      {!uploadResult && (
        <div className="mt-4 p-3 bg-gray-700 rounded-lg">
          <h3 className="text-md font-semibold text-white mb-2">How to Use</h3>
          <ol className="text-sm text-gray-300 list-decimal pl-5 space-y-1">
            <li>Download the sample CSV file using the button above</li>
            <li>Open it in your preferred spreadsheet application or text editor</li>
            <li>Each line represents a single RPN expression to calculate</li>
            <li>You can modify expressions or add new ones</li>
            <li>Save the file and upload it to test the calculator</li>
          </ol>
          <p className="text-xs text-gray-400 mt-2">
            Note: The sample file contains examples of both basic operations and advanced functions to demonstrate all capabilities.
          </p>
        </div>
      )}
    </div>
  );
} 