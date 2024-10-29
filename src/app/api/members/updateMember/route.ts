import { updateMember } from "@/database/database";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(req: any) {
  try {
    const { id, firstName, lastName, email } = await req.json();

    const data = await updateMember(id, firstName, lastName, email);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error getting data:", error);
    return NextResponse.json(
      { message: "Error getting data." },
      { status: 500 }
    );
  }
}
