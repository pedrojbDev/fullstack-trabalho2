import { NextResponse } from "next/server";
import { logoutService } from "@/backend/modules/auth/services";

export async function POST() {
  await logoutService();
  return NextResponse.json({ success: true });
}
