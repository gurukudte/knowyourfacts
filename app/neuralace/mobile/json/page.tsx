"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

interface CandidateData {
  startRange: string;
  startDate: string;
}

export interface Candidates {
  [sheetName: string]: CandidateData;
}

export default function JsonEditor() {
  const [jsonContent, setJsonContent] = useState<Candidates>({});
  const [editedContent, setEditedContent] = useState(
    JSON.stringify({}, null, 2)
  );
  const [editMode, setEditMode] = useState<string | null>(null);
  const [newCandidate, setNewCandidate] = useState({
    sheetName: "",
    startRange: "",
    startDate: "",
  });

  const loadJsonContent = async () => {
    try {
      const response = await fetch("/api/save-json");
      const data = await response.json();
      setJsonContent(data);
      setEditedContent(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error("Error loading JSON:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load candidates data",
      });
    }
  };

  useEffect(() => {
    loadJsonContent();
  }, []);

  const handleSave = async () => {
    try {
      const parsedJson = JSON.parse(editedContent);
      const response = await fetch("/api/save-json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedJson),
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      loadJsonContent();

      toast({
        title: "Success",
        description: "Candidates data saved successfully",
      });
    } catch (err) {
      console.error("Error saving JSON:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid JSON or failed to save",
      });
    }
  };

  const handleDelete = (sheetName: string) => {
    const updatedContent = { ...jsonContent };
    delete updatedContent[sheetName];
    setJsonContent(updatedContent);
    setEditedContent(JSON.stringify(updatedContent, null, 2));
  };

  const handleEdit = (sheetName: string) => {
    setEditMode(sheetName);
    const candidateData = jsonContent[sheetName];
    setNewCandidate({
      sheetName,
      ...candidateData,
    });
  };

  const handleUpdate = () => {
    if (!editMode) return;

    const updatedContent = { ...jsonContent };
    delete updatedContent[editMode];
    updatedContent[newCandidate.sheetName] = {
      startRange: newCandidate.startRange,
      startDate: newCandidate.startDate,
    };

    setJsonContent(updatedContent);
    setEditedContent(JSON.stringify(updatedContent, null, 2));
    setEditMode(null);
    setNewCandidate({ sheetName: "", startRange: "", startDate: "" });
  };

  const handleAdd = () => {
    const updatedContent = {
      ...jsonContent,
      [newCandidate.sheetName]: {
        startRange: newCandidate.startRange,
        startDate: newCandidate.startDate,
      },
    };
    setJsonContent(updatedContent);
    setEditedContent(JSON.stringify(updatedContent, null, 2));
    setNewCandidate({ sheetName: "", startRange: "", startDate: "" });
  };

  return (
    <div className="container py-10 max-w-4xl flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle>Edit Candidates JSON</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sheetName">Sheet Name</Label>
              <Input
                id="sheetName"
                value={newCandidate.sheetName}
                onChange={(e) =>
                  setNewCandidate({
                    ...newCandidate,
                    sheetName: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="startRange">Start Range</Label>
              <Input
                id="startRange"
                value={newCandidate.startRange}
                onChange={(e) =>
                  setNewCandidate({
                    ...newCandidate,
                    startRange: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={newCandidate.startDate}
                onChange={(e) =>
                  setNewCandidate({
                    ...newCandidate,
                    startDate: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <Button
            onClick={editMode ? handleUpdate : handleAdd}
            className="w-full"
          >
            {editMode ? "Update" : "Add New Entry"}
          </Button>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sheet Name</TableHead>
                <TableHead>Start Range</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(jsonContent).map(([sheetName, data]) => (
                <TableRow key={sheetName}>
                  <TableCell>{sheetName}</TableCell>
                  <TableCell>{data.startRange}</TableCell>
                  <TableCell>{data.startDate}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(sheetName)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(sheetName)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="space-y-2">
            <Label htmlFor="json-editor">Raw JSON</Label>
            <Textarea
              id="json-editor"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="font-mono min-h-[200px]"
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            Save All Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
