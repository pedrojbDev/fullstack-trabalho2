import { NextRequest, NextResponse } from "next/server";
import { createReminderService, simulateSendReminderService } from "@/services/data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.action === "simulate") {
      return NextResponse.json(await simulateSendReminderService(body.id));
    }
    return NextResponse.json(await createReminderService(body), { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

