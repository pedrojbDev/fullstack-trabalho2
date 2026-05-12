import { NextRequest, NextResponse } from "next/server";
import { signupService } from "@/modules/auth/services";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json(await signupService(body));
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Erro interno no cadastro" },
      { status: 400 },
    );
  }
}
