"use client";
import React from 'react';
import { Button } from "@/components/ui/button";

const SHEET_LINKS = [
  {
    name: "Venky spreadsheet",
    link: "https://docs.google.com/spreadsheets/d/1uyQDlWSkn5-6X-1t3dqrqsJIDPuyL041lmjMPU1Bc4Q/edit?gid=323933194#gid=323933194"
  },
  {
    name: "Madhosh spreadsheet", 
    link: "https://docs.google.com/spreadsheets/d/1lXkS7nDsC3-y2oQ725DqZoDuZXIqnf3rpAvPUe52iuE/edit?gid=271298769#gid=271298769"
  },
];

const SheetsPage = () => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Google Sheet Links</h1>
      
      <div className="grid gap-4">
        {SHEET_LINKS.map((sheet, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
          >
            <span className="text-lg font-medium">{sheet.name}</span>
            <div className="flex gap-4">
              <Button asChild variant="outline">
                <a href={sheet.link} target="_blank" rel="noopener noreferrer">
                  Open Sheet
                </a>
              </Button>
              <Button onClick={() => copyToClipboard(sheet.link)}>
                Copy Link
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SheetsPage;