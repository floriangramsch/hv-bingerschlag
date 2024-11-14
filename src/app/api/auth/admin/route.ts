import { login } from "@/database/database";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: any) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error("JWT_SECRET is not defined");
      }
      jwt.verify(token, secret);

      return NextResponse.json({ success: true });
    } catch (err) {
      console.error("Invalid token:", err);
      return NextResponse.json({ message: "Invalid token." }, { status: 403 });
    }
  } catch (error) {
    console.error("Error authentificating:", error);
    return NextResponse.json(
      { message: "Error authentificating." },
      { status: 500 }
    );
  }
}

export async function POST(request: any) {
  try {
    const password = await request.json();

    if (password === process.env.ADMIN_PW) {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error("JWT_SECRET is not defined");
      }
      const token = jwt.sign({ isAdmin: true }, secret, {
        expiresIn: "1h",
      });

      return NextResponse.json({ result: true, token }, { status: 201 });
    } else {
      return NextResponse.json(
        { result: false, message: "Wrong password" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error creating entry:", error);
    return NextResponse.json(
      { message: "Error creating entry." },
      { status: 500 }
    );
  }
}
