import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, supabaseServer } from "@lib";
import { getProjects, getNextProjectId } from "../../../lib/project";
import { PROJECT_PAGE_SIZE, ProjectContent } from "@types";
import { handleApiError, serializeProjectContent } from "@utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get("page") ?? 0);
    const limit = Number(searchParams.get("limit") ?? PROJECT_PAGE_SIZE);

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

    const { projects, hasMore, nextPage } = await getProjects(page, limit);

    return NextResponse.json({
      success: true,
      projects,
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

    const body = (await request.json()) as ProjectContent;
    if (!body.title?.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required." },
        { status: 400 }
      );
    }

    const supabase = supabaseServer();
    if (!supabase) throw new Error("Failed to create the server client instance.");

    const nextId = await getNextProjectId();
    const content = serializeProjectContent({
      title: body.title.trim(),
      link: body.link?.trim() ?? "",
      imageUrl: body.imageUrl?.trim() ?? "",
      description: body.description?.trim() ?? "",
    });

    const { data, error } = await supabase
      .from("project")
      .insert([{ id: nextId, content }])
      .select("id, created_at, content")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, id: data.id });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
