import { type NextRequest } from "next/server";
import { getShift, removeShift } from "@/database/database";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  try {
    if (id) {
      const data = await getShift(id);
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Error getting data:", error);
    return NextResponse.json(
      { message: "Error getting data." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: any) {
  try {
    const { id } = await request.json();

    const result = await removeShift(id);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error deleting shift:", error);
    return NextResponse.json(
      { message: "Error deleting shift." },
      { status: 500 }
    );
  }
}
