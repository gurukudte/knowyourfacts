import connectToMongoDB from "@/config/mongodb";
import { NextRequest, NextResponse } from "next/server";
import SheetData from "@/models/CandidateSessions";
import CandidateSessions from "@/models/CandidateSessions";

export async function GET(request: NextRequest) {
  await connectToMongoDB();
  try {
    const candidateName = request.nextUrl.searchParams.get("candidateName");
    const date = request.nextUrl.searchParams.get("date");
    const sheets = await CandidateSessions.find({ candidateName, date });
    return NextResponse.json(sheets);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch sheets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  await connectToMongoDB();
  try {
    const data = await request.json();
    console.log(data);
    const newSheet = new CandidateSessions(data);
    await newSheet.save();
    return NextResponse.json({ message: "Sheet created successfully" });
  } catch (error: any) {
    console.log(error.errors);
    return NextResponse.json(
      { error: "Failed to create sheet" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  await connectToMongoDB();
  try {
    const id = request.nextUrl.searchParams.get("id");
    const data = await request.json();
    const updatedSheet = await SheetData.findByIdAndUpdate(
      id,
      {
        ...data,
      },
      {
        new: true,
      }
    );
    if (!updatedSheet) {
      return NextResponse.json({ error: "Sheet not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Sheet updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update sheet" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  await connectToMongoDB();
  try {
    const id = request.nextUrl.searchParams.get("id");
    const deletedSheet = await SheetData.findByIdAndDelete(id);
    if (!deletedSheet) {
      return NextResponse.json({ error: "Sheet not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Sheet deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete sheet" },
      { status: 500 }
    );
  }
}
