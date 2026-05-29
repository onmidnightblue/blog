import { NextResponse } from "next/server";
import { supabaseServer } from "@lib";
import { OperatingHourType, SupabaseUpdateType } from "@types";
import { TIME_REGEX } from "@constants";
import { handleApiError } from "@utils";

export async function GET() {
  try {
    const supabase = supabaseServer();
    if (!supabase)
      throw new Error("Failed to create the server client instance.");
    const { data, error } = await supabase
      .from("restaurants")
      .select(`*, operating_hours(*), comments(id)`)
      .eq("comments.is_deleted", false)
      .neq("status_number", "03") // 폐업제외
      .order("land_address", { ascending: true })
      .order("day_of_week", {
        referencedTable: "operating_hours",
        ascending: true,
      })
      .order("created_at", {
        referencedTable: "comments",
        ascending: false,
      });

    if (error) throw error;

    const formattedData = data?.map((rest) => ({
      ...rest,
      comments: undefined,
    }));

    return NextResponse.json({
      success: true,
      count: formattedData?.length ?? 0,
      restaurants: formattedData ?? [],
    });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, type, ...updateData } = body;
    const supabase = supabaseServer();
    if (!supabase)
      throw new Error("Failed to create the server client instance.");

    const tableMap: Record<SupabaseUpdateType, string> = {
      OPERATING_HOURS: "operating_hours",
      COMMENTS: "comments",
      RESTAURANTS: "restaurants",
    };
    const targetTable = tableMap[(type as SupabaseUpdateType) || "RESTAURANTS"];

    if (type === "OPERATING_HOURS") {
      const timeFields = [
        "open_time",
        "close_time",
        "break_start",
        "break_end",
        "last_order",
      ];

      for (const key of timeFields) {
        const value = updateData[key];
        if (value && typeof value === "string" && !TIME_REGEX.test(value)) {
          return NextResponse.json(
            {
              success: false,
              error: `Invalid Key: ${key}`,
              fieldKey: key,
            },
            { status: 400 }
          );
        }
      }

      if (!updateData.restaurant_id && !id) {
        return NextResponse.json(
          {
            success: false,
            error: "'restaurant_id' is missing.",
            fieldKey: "restaurant_id",
          },
          { status: 400 }
        );
      }
    }

    const upsertPayload = { ...updateData };
    if (id) upsertPayload.id = id;

    let onConflict = "id";
    if (type === "OPERATING_HOURS") {
      onConflict = "restaurant_id, day_of_week";
    }

    const { error } = await supabase.from(targetTable).upsert(upsertPayload, {
      onConflict,
    });

    if (error) {
      return handleApiError(error);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type") as SupabaseUpdateType | null;

    if (!id || !type)
      return NextResponse.json(
        { success: false, error: "ID and Type required" },
        { status: 400 }
      );

    const supabase = supabaseServer();
    if (!supabase)
      throw new Error("Failed to create the server client instance.");

    const tableMap: Partial<Record<SupabaseUpdateType, string>> = {
      COMMENTS: "comments",
      OPERATING_HOURS: "operating_hours",
    };
    const targetTable = tableMap[type];
    if (!targetTable) throw new Error("Invalid delete type");

    const { error } = await supabase.from(targetTable).delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  const supabase = supabaseServer()!;
  const body = await req.json();
  const { id, operating_hours, ...restaurantData } = body;

  const { data: existing } = await supabase
    .from("restaurants")
    .select("id")
    .eq("id", id)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "This Restaurant ID is already in use." },
      { status: 409 }
    );
  }

  const { error: resError } = await supabase
    .from("restaurants")
    .insert([{ id, ...restaurantData }]);
  if (resError)
    return NextResponse.json({ error: resError.message }, { status: 400 });

  if (operating_hours && operating_hours.length > 0) {
    const hoursToInsert = operating_hours.map(
      ({ id, ...oh }: OperatingHourType) => ({
        ...oh,
        restaurant_id: id,
      })
    );
    const { error: hourError } = await supabase
      .from("operating_hours")
      .insert(hoursToInsert);
    if (hourError)
      return NextResponse.json({ error: hourError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, id });
}
