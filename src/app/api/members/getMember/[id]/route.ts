import { getMember } from "@/database/database";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: any) {
  try {
    const { id } = await req.json();

    const data = await getMember(id);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error getting data:", error);
    return NextResponse.json(
      { message: "Error getting data." },
      { status: 500 }
    );
  }
}
