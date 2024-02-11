import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");

  if (path) {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true });
  } else {
    return NextResponse.json({ message: "No path specified" }, { status: 400 });
  }
}
