"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

/**
 * Google Sheets IMPORTRANGE Formula Generator
 * 
 * This React component provides a user interface for generating IMPORTRANGE formulas
 * for Google Sheets. It allows users to input a spreadsheet URL, sheet name, and cell
 * range to create a properly formatted IMPORTRANGE formula that can be copied to clipboard.
 * 
 * Key Features:
 * - Input validation for required fields
 * - Automatic formula generation
 * - One-click copy to clipboard functionality
 * - Visual feedback with generated formula display
 */
const Page: React.FC = () => {
  // State for form inputs and generated formula
  const [url, setUrl] = useState('');
  const [sheetName, setSheetName] = useState('');
  const [range, setRange] = useState('');
  const [formula, setFormula] = useState('');

  /**
   * Generates an IMPORTRANGE formula from user inputs and copies it to clipboard
   * Validates that all required fields are filled before generating
   */
  const generateFormula = () => {
    // Validate inputs
    if (!url || !sheetName || !range) {
      alert('Please fill in all fields');
      return;
    }

    // Create the IMPORTRANGE formula
    const formula = `=IMPORTRANGE("${url}","${sheetName}!${range}")`;
    setFormula(formula);

    // Copy to clipboard
    navigator.clipboard.writeText(formula);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Google Sheets IMPORTRANGE Formula Generator</h1>
      
      <div className="space-y-4">
        {/* Spreadsheet URL input */}
        <div>
          <label className="block text-sm font-medium mb-1">Spreadsheet URL</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/..."
          />
        </div>

        {/* Sheet name input */}
        <div>
          <label className="block text-sm font-medium mb-1">Sheet Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={sheetName}
            onChange={(e) => setSheetName(e.target.value)}
            placeholder="Sheet1"
          />
        </div>

        {/* Cell range input */}
        <div>
          <label className="block text-sm font-medium mb-1">Range</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            placeholder="A1:B10"
          />
        </div>

        {/* Generate formula button */}
        <Button 
          onClick={generateFormula}
          className="w-full"
          size={"lg"}
        >
          Generate Formula & Copy to Clipboard
        </Button>

        {/* Display generated formula if one exists */}
        {formula && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-2">Generated Formula:</p>
            <code className="block p-2 bg-background border rounded break-all">
              {formula}
            </code>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;