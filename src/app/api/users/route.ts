import { supabaseServer } from "@lib";
import { handleApiError } from "@utils";
import { NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

export async function GET(req: Request) {
  try {
    const supabase = supabaseServer()!;

    // user agent
    const uaString = req.headers.get("user-agent") || "";
    const parser = new UAParser(uaString);
    const browser = parser.getBrowser().name || "Unknown";
    const os = parser.getOS().name || "Unknown";
    const deviceType = parser.getDevice().type || "desktop";

    // ip
    const forwardedFor = req.headers.get("x-forwarded-for");
    let ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
    if (ip === "::1" || ip === "127.0.0.1") {
      ip = "221.149.165.1"; // temp
    }
    let location = "Unknown";
    try {
      const geoResponse = await fetch(`http://ip-api.com/json/${ip}?lang=ko`);
      const geoData = await geoResponse.json();
      if (geoData.status === "success") {
        location = `${geoData.regionName} ${geoData.city}`.trim();
      }
    } catch (geoError) {
      console.error(geoError);
    }

    // last user_id
    const { data: lastUser, error: selectError } = await supabase
      .from("users")
      .select("id")
      .order("id", { ascending: false })
      .limit(1);

    if (selectError) {
      return handleApiError(selectError);
    }

    const nextUserId =
      lastUser && Array.isArray(lastUser) && lastUser.length > 0
        ? Number(lastUser[0].id) + 1
        : 1;

    // insert new user_id
    const { error: insertError } = await supabase.from("users").insert([
      {
        id: nextUserId,
        device: deviceType,
        os: os,
        browser: browser,
        location: location,
      },
    ]);

    if (insertError) {
      return handleApiError(insertError);
    }

    return NextResponse.json({ user_id: nextUserId });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
