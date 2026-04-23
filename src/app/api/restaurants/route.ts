import { NextResponse } from "next/server";
import { supabaseServer } from "@lib";

export async function GET() {
  try {
    const supabase = supabaseServer();
    if (!supabase)
      throw new Error("Failed to create ther server client instance.");
    const { data, error } = await supabase
      .from("restaurants")
      .select("*")
      .order("land_address", { ascending: true });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      count: data.length,
      restaurants: data,
    });
  } catch (error: unknown) {
    const message = (error as Error)?.message ?? "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      );
    }

    const supabase = supabaseServer();
    if (!supabase)
      throw new Error("Failed to create ther server client instance.");
    const { error } = await supabase
      .from("restaurants")
      .update(updateData)
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = (error as Error)?.message ?? "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
