import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, supabaseServer } from "@lib";
import { getBoardPostById } from "../../../../lib/board";
import { BoardPostContent } from "@types";
import { handleApiError, serializeBoardContent, toBoardPost } from "@utils";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const postId = Number(id);

    if (!Number.isInteger(postId) || postId < 1) {
      return NextResponse.json(
        { success: false, error: "Invalid post id." },
        { status: 400 }
      );
    }

    const post = await getBoardPostById(postId);
    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, post });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const postId = Number(id);

    if (!Number.isInteger(postId) || postId < 1) {
      return NextResponse.json(
        { success: false, error: "Invalid post id." },
        { status: 400 }
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

    const content = serializeBoardContent({
      title: body.title.trim(),
      summary: body.summary?.trim() ?? "",
      tags: body.tags ?? [],
      body: body.body ?? "",
    });

    const { data, error } = await supabase
      .from("board")
      .update({ content })
      .eq("id", postId)
      .select("id, created_at, content")
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json(
        { success: false, error: "Post not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, post: toBoardPost(data) });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const postId = Number(id);

    if (!Number.isInteger(postId) || postId < 1) {
      return NextResponse.json(
        { success: false, error: "Invalid post id." },
        { status: 400 }
      );
    }

    const supabase = supabaseServer();
    if (!supabase) throw new Error("Failed to create the server client instance.");

    const { error } = await supabase.from("board").delete().eq("id", postId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
