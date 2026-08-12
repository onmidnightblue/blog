import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, supabaseServer } from "@lib";
import { getProjectById } from "../../../../lib/project";
import { ProjectContent } from "@types";
import { handleApiError, serializeProjectContent, toProject } from "@utils";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const projectId = Number(id);

    if (!Number.isInteger(projectId) || projectId < 1) {
      return NextResponse.json(
        { success: false, error: "Invalid project id." },
        { status: 400 }
      );
    }

    const project = await getProjectById(projectId);
    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project });
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
    const projectId = Number(id);

    if (!Number.isInteger(projectId) || projectId < 1) {
      return NextResponse.json(
        { success: false, error: "Invalid project id." },
        { status: 400 }
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

    const content = serializeProjectContent({
      title: body.title.trim(),
      link: body.link?.trim() ?? "",
      imageUrl: body.imageUrl?.trim() ?? "",
      description: body.description?.trim() ?? "",
    });

    const { data, error } = await supabase
      .from("project")
      .update({ content })
      .eq("id", projectId)
      .select("id, created_at, content")
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json(
        { success: false, error: "Project not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project: toProject(data) });
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
    const projectId = Number(id);

    if (!Number.isInteger(projectId) || projectId < 1) {
      return NextResponse.json(
        { success: false, error: "Invalid project id." },
        { status: 400 }
      );
    }

    const supabase = supabaseServer();
    if (!supabase) throw new Error("Failed to create the server client instance.");

    const { error } = await supabase.from("project").delete().eq("id", projectId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
