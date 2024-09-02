// pages/api/getData.js
import { getUsers } from "@/database/database";
import { NextResponse } from "next/server";

export async function GET(req: any, res: any) {
  try {
    const data = await getUsers();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error getting data:", error);
    return NextResponse.json(
      { message: "Error getting data." },
      { status: 500 }
    );
  }
}
