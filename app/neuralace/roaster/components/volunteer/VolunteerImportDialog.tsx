"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, Download, X, Eye } from "lucide-react";
import * as XLSX from "xlsx";
import { useAppContext } from "../../context/AppContext";
import { Volunteer } from "./VolunteerForm";

export default function VolunteerImportDialog() {
  const { bulkAddVolunteers } = useAppContext();
  const [file, setFile] = useState<File | null>(null);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");

  // Handle file upload or drag-drop
  const handleFileUpload = (f: File) => {
    setFile(f);
    parseFile(f);
  };

  // Parse CSV/Excel file
  const parseFile = async (file: File) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);
    console.log(jsonData);
    const transFormed: Volunteer[] = jsonData?.map((i: any, idx) => {
      return {
        id: idx,
        name: i["name"],
        preferredShift: i["preferred_shift"],
        weekOffDays: i["weekOff"].split("/"),
      };
    });
    console.log(transFormed);
    setVolunteers(transFormed);
    setActiveTab("view");
  };

  const handleImport = async () => {
    setIsLoading(true);
    // Simulate import delay
    setTimeout(() => {
      bulkAddVolunteers(volunteers);
      setIsLoading(false);
      alert(`Imported ${volunteers.length} volunteers!`);
      setFile(null);
      setVolunteers([]);
      setActiveTab("upload");
    }, 1200);
  };

  const handleDownloadSample = () => {
    const sample = [
      {
        name: "John Doe",
        email_id: "volunteer1@gmail.com",
        phone: "1234567890",
        preferred_shift: "Morning",
        weekOff: "Sunday",
      },
      {
        name: "Jane Smith",
        email_id: "volunteer2@gmail.com",
        phone: "0987654321",
        preferred_shift: "Evening",
        weekOff: "Monday",
      },
    ];
    const worksheet = XLSX.utils.json_to_sheet(sample);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Volunteers");
    XLSX.writeFile(workbook, "volunteer_sample.xlsx");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 text-green-700 border border-green-200 rounded-lg font-medium hover:bg-green-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          <Upload className="w-4 h-4" /> Import Volunteers
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            Import Volunteers
          </DialogTitle>
        </DialogHeader>

        {/* Tabs for Upload and View */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-3">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="view" disabled={!file}>
              <Eye className="w-4 h-4 mr-1" /> View Data
            </TabsTrigger>
          </TabsList>

          {/* === Upload Tab === */}
          <TabsContent value="upload">
            <div
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted transition"
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files.length > 0) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <FileSpreadsheet className="w-8 h-8 text-green-600" />
                  <p className="text-sm font-medium text-gray-700">
                    {file.name}
                  </p>
                  <button
                    className="text-xs text-red-600 hover:underline flex items-center gap-1"
                    onClick={() => {
                      setFile(null);
                      setVolunteers([]);
                    }}
                  >
                    <X className="w-3 h-3" /> Remove file
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-2 cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag & drop or click to upload CSV/XLSX file
                  </p>
                  <input
                    type="file"
                    accept=".csv, .xlsx"
                    onChange={(e) => {
                      if (e.target.files?.[0])
                        handleFileUpload(e.target.files[0]);
                    }}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleDownloadSample}
              >
                <Download className="w-4 h-4" /> Download Sample
              </Button>

              {volunteers.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {volunteers.length} records detected
                </p>
              )}
            </div>
          </TabsContent>

          {/* === View Data Tab === */}
          <TabsContent value="view">
            {volunteers.length > 0 ? (
              <div className="border rounded-lg max-h-72 overflow-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead className="bg-muted text-gray-700 sticky top-0">
                    <tr>
                      {Object.keys(volunteers[0]).map((key) => (
                        <th
                          key={key}
                          className="px-4 py-2 text-left border-b font-medium capitalize"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {volunteers.slice(0, 50).map((row, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        {Object.values(row).map((value, i) => (
                          <td key={i} className="px-4 py-2 whitespace-nowrap">
                            {String(value ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center mt-4">
                No data to display. Please upload a file first.
              </p>
            )}
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <DialogFooter className="mt-6 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleImport}
            disabled={!file || volunteers.length === 0 || isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? "Importing..." : "Import Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
