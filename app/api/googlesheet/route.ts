import { google } from "googleapis";
import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

interface UpdateSheetRequest {
  range: string;
  values: (string | number | null)[][];
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = (await request.json()) as UpdateSheetRequest;
    const { range, values } = body;

    if (!range || !values) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Load credentials from the service account key file
    const keyFilePath = path.join(process.cwd(), "credentials.json"); // Path to your JSON key file
    const credentials = JSON.parse(await fs.readFile(keyFilePath, "utf8"));

    // Authenticate with Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Update the sheet
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID; // Spreadsheet ID from .env.local
    if (!spreadsheetId) {
      throw new Error("Spreadsheet ID is not set in environment variables");
    }

    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range, // e.g., "Sheet1!A1:B2"
      valueInputOption: "RAW",
      requestBody: { values }, // Data to update
    });

    return NextResponse.json({
      message: "Sheet updated successfully",
      response: response.data,
    });
  } catch (error: any) {
    console.error("Error updating Google Sheet:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
