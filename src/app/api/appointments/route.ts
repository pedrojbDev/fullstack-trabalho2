import { NextRequest, NextResponse } from "next/server";
import {
  createAppointmentService,
  listAppointments,
  updateAppointmentService,
  updateAppointmentStatus,
} from "@/backend/modules/appointments/services";

export async function GET() {
  try {
    return NextResponse.json(await listAppointments());
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json(
      await createAppointmentService(await request.json()),
      { status: 201 },
    );
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.action === "cancel")
      return NextResponse.json(await updateAppointmentStatus(body.id, "cancelled"));
    if (body.action === "confirm")
      return NextResponse.json(await updateAppointmentStatus(body.id, "confirmed"));
    if (body.action === "complete")
      return NextResponse.json(await updateAppointmentStatus(body.id, "completed"));
    return NextResponse.json(await updateAppointmentService(body.id, body));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
