import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, supabaseServer } from "@lib";
import { getBoardPosts, getNextBoardId } from "../../../lib/board";
import { BOARD_PAGE_SIZE, BoardPostContent } from "@types";
import { handleApiError, serializeBoardContent } from "@utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get("page") ?? 0);
    const limit = Number(searchParams.get("limit") ?? BOARD_PAGE_SIZE);

    if (!Number.isInteger(page) || page < 0) {
      return NextResponse.json(
        { success: false, error: "Invalid page parameter." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 20) {
      return NextResponse.json(
        { success: false, error: "Invalid limit parameter." },
        { status: 400 }
      );
    }

    const { posts, hasMore, nextPage } = await getBoardPosts(page, limit);

    return NextResponse.json({
      success: true,
      posts,
      hasMore,
      nextPage,
    });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = (await request.json()) as BoardPostContent;
    if (!body.title?.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required." },
        { status: 400 }
      );
    }

    const supabase = supabaseServer();
    if (!supabase) throw new Error("Failed to create the server client instance.");

    const nextId = await getNextBoardId();
    const content = serializeBoardContent({
      title: body.title.trim(),
      summary: body.summary?.trim() ?? "",
      tags: body.tags ?? [],
      body: body.body ?? "",
    });

    const { data, error } = await supabase
      .from("board")
      .insert([{ id: nextId, content }])
      .select("id, created_at, content")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, id: data.id });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
