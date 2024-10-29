import { getShift } from "@/database/database";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const data = await getShift(id);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error getting data:", error);
    return NextResponse.json(
      { message: "Error getting data." },
      { status: 500 }
    );
  }
}
