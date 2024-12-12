import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const jsonFilePath = path.join(
  process.cwd(),
  "app/neuralace/mobile/json/candidates.json"
);

export async function GET() {
  try {
    const jsonData = await fs.readFile(jsonFilePath, "utf8");
    return NextResponse.json(JSON.parse(jsonData));
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read JSON file" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ message: "JSON file updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update JSON file" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const newData = await request.json();
    const existingData = JSON.parse(await fs.readFile(jsonFilePath, "utf8"));
    const updatedData = { ...existingData, ...newData };
    await fs.writeFile(jsonFilePath, JSON.stringify(updatedData, null, 2));
    return NextResponse.json({ message: "JSON file merged successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to merge JSON file" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await fs.writeFile(jsonFilePath, JSON.stringify({}, null, 2));
    return NextResponse.json({ message: "JSON file cleared successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to clear JSON file" },
      { status: 500 }
    );
  }
}
