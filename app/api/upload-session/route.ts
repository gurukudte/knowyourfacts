import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define Zod schema for validation
const sessionSchema = z.object({
  "Session #": z.number(),
  "Start (Time)": z.string(),
  "End (Time)": z.string(),
  "Break (min)": z.number(),
  "Mic (min)": z.number(),
  "Sys (min)": z.number(),
  "Max (min)": z.number(),
  "Mic .wav": z.string(),
  "Sys .wav": z.string(),
  "Timestamp": z.string(),
});

const summarySchema = z.object({
  Name: z.string(),
  Email: z.string().optional(),
  Phone: z.string().optional(),
  Date: z.string(),
  "Total Sessions": z.number(),
  "Start Time": z.string(),
  "End Time": z.string(),
  "Total Recording Time": z.string(),
  "Total Break Duration": z.string(),
});

const payloadSchema = z.object({
  summary: summarySchema,
  sessions: z.array(sessionSchema),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate payload
    const validationResult = payloadSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { summary, sessions } = validationResult.data;

    // Check for existing summary by Name and Date
    const existingSummary = await prisma.dailySummary.findFirst({
      where: {
        name: summary.Name,
        date: summary.Date,
      },
    });

    let savedSummary;

    if (existingSummary) {
      // Update existing record
      // First, delete existing sessions associated with this summary to replace them
      await prisma.session.deleteMany({
        where: {
          dailySummaryId: existingSummary.id,
        },
      });

      // Update summary and create new sessions
      savedSummary = await prisma.dailySummary.update({
        where: {
          id: existingSummary.id,
        },
        data: {
          totalSessions: summary["Total Sessions"],
          startTime: summary["Start Time"],
          endTime: summary["End Time"],
          totalRecordingTime: summary["Total Recording Time"],
          totalBreakDuration: summary["Total Break Duration"],
          email: summary.Email || "",
          phone: summary.Phone || "",
          sessions: {
            create: sessions.map((session) => ({
              sessionNumber: session["Session #"],
              startTime: session["Start (Time)"],
              endTime: session["End (Time)"],
              breakDuration: session["Break (min)"],
              micDurationMin: session["Mic (min)"],
              sysDurationMin: session["Sys (min)"],
              maxDurationMin: session["Max (min)"],
              micWav: session["Mic .wav"],
              sysWav: session["Sys .wav"],
              timestamp: session["Timestamp"],
            })),
          },
        },
      });
    } else {
      // Create new record
      savedSummary = await prisma.dailySummary.create({
        data: {
          name: summary.Name,
          date: summary.Date,
          email: summary.Email,
          phone: summary.Phone,
          totalSessions: summary["Total Sessions"],
          startTime: summary["Start Time"],
          endTime: summary["End Time"],
          totalRecordingTime: summary["Total Recording Time"],
          totalBreakDuration: summary["Total Break Duration"],
          sessions: {
            create: sessions.map((session) => ({
              sessionNumber: session["Session #"],
              startTime: session["Start (Time)"],
              endTime: session["End (Time)"],
              breakDuration: session["Break (min)"],
              micDurationMin: session["Mic (min)"],
              sysDurationMin: session["Sys (min)"],
              maxDurationMin: session["Max (min)"],
              micWav: session["Mic .wav"],
              sysWav: session["Sys .wav"],
              timestamp: session["Timestamp"],
            })),
          },
        },
      });
    }

    return NextResponse.json(
      { message: "Data saved successfully", id: savedSummary.id, action: existingSummary ? "updated" : "created" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving session data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
