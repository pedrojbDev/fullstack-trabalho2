import { NextRequest, NextResponse } from "next/server";
import { loginService } from "@/modules/auth/services";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json(await loginService(body));
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Erro interno no login" },
      { status: 400 },
    );
  }
}
