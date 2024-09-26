import { getSurveysToAssign } from "@/database/database";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await getSurveysToAssign();

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating entry:", error);
    return NextResponse.json(
      { message: "Error creating entry." },
      { status: 500 }
    );
  }
}
