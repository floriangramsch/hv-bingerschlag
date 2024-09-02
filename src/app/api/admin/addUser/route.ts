import { addUser } from "@/database/database";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  try {
    const user = await request.json();

    const result = await addUser(user);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating entry:", error);
    return NextResponse.json(
      { message: "Error creating entry." },
      { status: 500 }
    );
  }
}
