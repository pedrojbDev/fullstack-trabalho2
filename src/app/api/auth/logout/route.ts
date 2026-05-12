import { NextResponse } from "next/server";
import { logoutService } from "@/modules/auth/services";

export async function POST() {
  await logoutService();
  return NextResponse.json({ success: true });
}
