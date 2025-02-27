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
import useTechnician from "./useTechnicianHook";

export default function JsonEditor() {
  const {
    states: { allTechnicianData, editMode, newTechSheetData },
    handlers: { handleAdd, handleEdit, setNewTechSheetData },
    apiCalls: { handleUpdate, handleDelete },
  } = useTechnician();

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
              <Label htmlFor="technicianName">Technician Name</Label>
              <Input
                id="technicianName"
                value={newTechSheetData.technicianName}
                onChange={(e) =>
                  setNewTechSheetData({
                    ...newTechSheetData,
                    technicianName: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="sheetId">Sheet ID</Label>
              <Input
                id="sheetId"
                value={newTechSheetData.sheetID}
                onChange={(e) =>
                  setNewTechSheetData({
                    ...newTechSheetData,
                    sheetID: e.target.value,
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
            {allTechnicianData.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Technician Name</TableHead>
                    <TableHead>Sheet ID</TableHead>
                    <TableHead className="flex justify-center items-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allTechnicianData.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>{data.technicianName}</TableCell>
                      <TableCell>{data.sheetID}</TableCell>
                      <TableCell className="space-x-2 flex justify-center items-center">
                        <Button
                          disabled={editMode !== null}
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(data.technicianName)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          disabled={editMode !== null}
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(data.id)}
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
                  {allTechnicianData ? (
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
