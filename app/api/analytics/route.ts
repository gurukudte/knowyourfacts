import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const summaries = await prisma.dailySummary.findMany({
      include: {
        sessions: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(summaries, { status: 200 });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
