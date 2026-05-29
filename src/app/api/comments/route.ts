export const dynamic = "force-dynamic";

import { supabaseServer } from "@lib";
import { API_CACHE_HEADER, handleApiError } from "@utils";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    const supabase = supabaseServer()!;
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurant_id");

    if (!restaurantId) {
      return NextResponse.json(
        { success: false, error: "restaurant_id is empty" },
        { status: 400 }
      );
    }

    const { data: comments, error } = await supabase
      .from("comments")
      .select(
        `
      id,
      content,
      restaurant_id,
      user_id,
      created_at,
      users (
        device,
        browser,
        location
      )
    `
      )
      .eq("restaurant_id", restaurantId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (error) {
      return handleApiError(error);
    }

    return NextResponse.json({ success: true, comments }, API_CACHE_HEADER);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const supabase = supabaseServer()!;
    const body = await req.json();
    const { content, restaurant_id, user_id, password } = body;

    if (!content?.trim() || !restaurant_id || !user_id || !password?.trim()) {
      return NextResponse.json(
        { success: false, error: "A required field is missing." },
        { status: 400 }
      );
    }

    const salt = 10;
    const cryptPassword = await bcrypt.hash(password.trim(), salt);
    const { data: newComment, error } = await supabase
      .from("comments")
      .insert([
        {
          content: content.trim(),
          restaurant_id,
          user_id: Number(user_id),
          password: cryptPassword,
        },
      ])
      .select();

    if (error) {
      return handleApiError(error);
    }

    return NextResponse.json({ success: true, comment: newComment[0] });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = supabaseServer()!;
    const body = await req.json();
    const { comment_id, password } = body;

    if (!comment_id || !password) {
      return NextResponse.json(
        { success: false, error: "A required field is missing." },
        { status: 400 }
      );
    }

    const { data: comment, error } = await supabase
      ?.from("comments")
      .select("password")
      .eq("id", comment_id)
      .single();

    if (error || !comment) {
      return NextResponse.json(
        { success: false, error: `Not found ${comment_id} comment.` },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(password.trim(), comment.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: `Invalid password.` },
        { status: 401 }
      );
    }

    const { error: updateError } = await supabase
      .from("comments")
      .update({ is_deleted: true })
      .eq("id", comment_id);

    if (updateError) throw updateError;
    return NextResponse.json({ success: true, message: "success" });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
