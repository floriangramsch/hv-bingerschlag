import useSendTelegram from "@/app/helpers/useSendTelegram";
import { addSurvey } from "@/database/database";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  try {
    const selectedOptions: [number, Record<number, string>] =
      await request.json();

    const result = await addSurvey(selectedOptions);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating entry:", error);
    return NextResponse.json(
      { message: "Error creating entry." },
      { status: 500 }
    );
  }
}
