"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
import useCandidate from "../hooks/useCandidateHook";

export default function JsonEditor() {
  const {
    states: { allData, editMode, newCandidate },
    handlers: { handleAdd, handleEdit, setNewCandidate },
    apiCalls: { handleUpdate, handleDelete },
  } = useCandidate();

  return (
    <div className="w-full container py-10 flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-center">
            Candidates Editor
          </CardTitle>
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
                value={newCandidate.sheetRange}
                onChange={(e) =>
                  setNewCandidate({
                    ...newCandidate,
                    sheetRange: e.target.value,
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
          <div className=" flex justify-center items-center">
            {allData.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sheet Name</TableHead>
                    <TableHead>Start Range</TableHead>
                    <TableHead className="flex justify-center items-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allData.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>{data.sheetName}</TableCell>
                      <TableCell>{data.sheetRange}</TableCell>
                      <TableCell className="space-x-2 flex justify-center items-center">
                        <Button
                          disabled={editMode !== null}
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(data.sheetName)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          disabled={editMode !== null}
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(data._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-8">
                <span className="flex items-center gap-2">
                  {allData ? (
                    <>
                      <span>No Data</span>
                    </>
                  ) : (
                    <>
                      <span className="animate-spin">⏳</span>
                      Loading...
                    </>
                  )}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
