import { NextRequest, NextResponse } from "next/server";
import {
  getAgendaSettings,
  updateAgendaSettingsService,
} from "@/backend/modules/settings/services";

export async function GET() {
  try {
    return NextResponse.json(await getAgendaSettings());
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json(
      await updateAgendaSettingsService(await request.json()),
    );
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
