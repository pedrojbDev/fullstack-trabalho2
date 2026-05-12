import { NextRequest, NextResponse } from "next/server";
import {
  createBlockedTimeService,
  listBlockedTimes,
} from "@/modules/blocked-times/services";

export async function GET() {
  try {
    return NextResponse.json(await listBlockedTimes());
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json(
      await createBlockedTimeService(await request.json()),
      { status: 201 },
    );
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
