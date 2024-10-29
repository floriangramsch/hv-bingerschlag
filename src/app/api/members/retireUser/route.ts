import { retireUser } from "@/database/database";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(req: any) {
  try {
    const { id, retire } = await req.json();

    const data = await retireUser(id, retire);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error getting data:", error);
    return NextResponse.json(
      { message: "Error getting data." },
      { status: 500 }
    );
  }
}
