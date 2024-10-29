import { updateShift } from "@/database/database";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(req: any) {
  try {
    const { id, date, endDate, worker1_id, worker2_id, specialName } =
      await req.json();

    const data = await updateShift(
      id,
      date,
      endDate,
      worker1_id,
      worker2_id,
      specialName
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error getting data:", error);
    return NextResponse.json(
      { message: "Error getting data." },
      { status: 500 }
    );
  }
}
