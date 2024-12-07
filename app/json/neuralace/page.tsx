"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Page = () => {
  const [formData, setFormData] = useState({
    username: "",
    current_session: 1,
    current_block: 0,
    current_session_id: "",
    last_session_id: "",
    last_completed_session: 1,
    last_completed_block: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDropdownChange = (field: string, value: string) => {
    if (
      field === "username" ||
      field === "current_session_id" ||
      field === "last_session_id"
    ) {
      setFormData({ ...formData, [field]: value });
    } else {
      setFormData({ ...formData, [field]: Number(value) });
    }
  };

  const downloadJSON = () => {
    const jsonData = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "state.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="max-w-lg mx-auto mt-10 shadow-md">
      <CardHeader>
        <CardTitle>JSON Creator Tool</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            downloadJSON();
          }}
          className="space-y-4"
        >
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
            />
          </div>
          {/* Last Session ID */}
          <div>
            <label
              htmlFor="last_session_id"
              className="block text-sm font-medium text-gray-700"
            >
              Last Session ID
            </label>
            <Input
              id="last_session_id"
              name="last_session_id"
              value={formData.last_session_id.toString()}
              onChange={handleChange}
              placeholder="Enter last session ID"
            />
          </div>

          {/* Last Completed Session Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Completed Session
            </label>
            <Select
              value={formData.last_completed_session.toString()}
              onValueChange={(value) =>
                handleDropdownChange("last_completed_session", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select session" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 13 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    Session {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Last Completed Block Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Completed Block
            </label>
            <Select
              value={formData.last_completed_block.toString()}
              onValueChange={(value) =>
                handleDropdownChange("last_completed_block", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select block" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 6 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    Block {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* current Session ID */}
          <div>
            <label
              htmlFor="last_session_id"
              className="block text-sm font-medium text-gray-700"
            >
              Current Session ID
            </label>
            <Input
              id="current_session_id"
              name="current_session_id"
              value={formData.current_session_id.toString()}
              onChange={handleChange}
              placeholder="Enter current session ID"
            />
          </div>
          {/* Current Session Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Session
            </label>
            <Select
              value={formData.current_session.toString()}
              onValueChange={(value) =>
                handleDropdownChange("current_session", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select session" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 13 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    Session {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current Block Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Block
            </label>
            <Select
              value={formData.current_block.toString()}
              onValueChange={(value) =>
                handleDropdownChange("current_block", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select block" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 6 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    Block {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Download JSON
          </Button>
      </CardContent>
    </Card>
  );
};

export default Page;
