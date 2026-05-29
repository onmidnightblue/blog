import axios from "axios";
import { NextResponse } from "next/server";
import { supabaseServer } from "@lib";
import { GovApiResponse, RestaurantType } from "@types";
import { handleApiError } from "@utils";

const BATCH_SIZE = 1000; // 한 번에 요청할 데이터 양
const MAX_ITERATIONS = 100; // 최대 반복 횟수
const GOV_API_BASE_URL = `http://openapi.seoul.go.kr:8088/${process.env.GOV_API_KEY}/json/LOCALDATA_072404_YD`;

const syncHandler = async (targetStatus: "01" | "03") => {
  const supabase = supabaseServer();
  if (!supabase) throw new Error("Failed to create the server client instance");

  // exist restaurants
  const { data: existingRecords } = await supabase
    .from("restaurants")
    .select("id")
    .range(0, 5000);
  const existingIds = new Set((existingRecords || []).map((r) => String(r.id)));
  console.log(existingIds.size);

  let allProcessed: Partial<RestaurantType>[] = [];
  let totalScanned = 0;

  // detail
  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const startIndex = i * BATCH_SIZE + 1;
    const endIndex = (i + 1) * BATCH_SIZE;
    const { data } = await axios.get<GovApiResponse>(
      `${GOV_API_BASE_URL}/${startIndex}/${endIndex}`
    );
    const result = data?.LOCALDATA_072404_YD;
    if (result?.RESULT?.CODE !== "INFO-000" || !result?.row) break;
    totalScanned = endIndex;

    const filtered = result.row
      .filter((item) => {
        const isTargetStatus = item.TRDSTATEGBN === targetStatus;
        const isYeouido = item.SITEWHLADDR?.includes("여의도동");
        if (!isTargetStatus || !isYeouido) return false;
        const buildingMatch = item.SITEWHLADDR?.match(
          /여의도동\s*(\d+)(?:-(\d+))?/
        );
        if (buildingMatch) {
          const buildingNum = parseInt(buildingMatch[1], 10);
          return buildingNum >= 1 && buildingNum <= 19;
        }
        return false;
      })
      .map((item) => ({
        id: item.MGTNO,
        name: item.BPLCNM?.trim(),
        category: item.UPTAENM,
        phone: item.SITETEL?.trim(),
        road_address: item.RDNWHLADDR?.trim(),
        land_address: item.SITEWHLADDR?.trim(),
        status_number: item.TRDSTATEGBN,
        x: item.X?.trim(),
        y: item.Y?.trim(),
        map_x: "",
        map_y: "",
        is_visible: true,
        has_room: false,
        has_course: false,
        keyword: "",
        is_complete: false,
      }));

    if (filtered.length > 0) allProcessed = [...allProcessed, ...filtered];
  }

  const uniqueProcessed = Array.from(
    new Map(allProcessed.map((item) => [item.id, item])).values()
  );
  const newItems = uniqueProcessed.filter((item) => !existingIds.has(item.id!));

  if (newItems.length > 0) {
    console.log(`[Status: ${targetStatus}] New: ${newItems.length}`);
    console.table(
      newItems.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
      }))
    );
  } else {
    console.log(`[Status: ${targetStatus}] 새로 추가된 식당이 없습니다.`);
  }

  const updateCount = 0;

  // if (targetStatus === "01") {
  //   if (newItems.length > 0) {
  //     const { error } = await supabase.from("restaurants").insert(newItems);
  //     if (error) throw error;
  //     updateCount = newItems.length;
  //   }
  // } else if (targetStatus === "03") {
  //   for (const item of uniqueProcessed) {
  //     if (existingIds.has(item.id as string)) {
  //       const { error } = await supabase
  //         .from("restaurants")
  //         .update({ status_number: "03" })
  //         .eq("id", item.id);
  //       if (error) throw error;
  //       updateCount++;
  //     } else {
  //       const { error } = await supabase.from("restaurants").insert(item);
  //       if (error) throw error;
  //       updateCount++;
  //     }
  //   }
  // }

  return { totalScanned, updateCount };
};

export async function GET() {
  try {
    const result01 = await syncHandler("01");
    const result03 = await syncHandler("03");

    return NextResponse.json({
      success: true,
      operating: result01,
      closed: result03,
    });
  } catch (error: unknown) {
    console.error("API Route Error:", error);
    return handleApiError(error);
  }
}
