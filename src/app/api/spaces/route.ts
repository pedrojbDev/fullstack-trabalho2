import { NextRequest, NextResponse } from "next/server";
import {
  archiveSpace,
  createSpaceService,
  listSpaces,
  updateSpaceService,
} from "@/modules/spaces/services";

export async function GET() {
  try {
    return NextResponse.json(await listSpaces());
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json(
      await createSpaceService(await request.json()),
      { status: 201 },
    );
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json(await updateSpaceService(body.id, body));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await archiveSpace(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
