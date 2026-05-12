import { NextRequest, NextResponse } from "next/server";
import {
  archiveClient,
  createClientService,
  listClients,
  updateClientService,
} from "@/modules/clients/services";

export async function GET() {
  try {
    return NextResponse.json(await listClients());
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json(
      await createClientService(await request.json()),
      { status: 201 },
    );
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json(await updateClientService(body.id, body));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await archiveClient(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
