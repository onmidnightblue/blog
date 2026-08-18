import { supabaseServer } from "./supabase";
import { toBoardPost, toBoardPostListItem } from "@utils";
import type { BoardPostSummary } from "@types";

export const getNextBoardId = async () => {
  const supabase = supabaseServer();
  if (!supabase) throw new Error("Failed to create the server client instance.");

  const { data, error } = await supabase
    .from("board")
    .select("id")
    .order("id", { ascending: false })
    .limit(1);

  if (error) throw error;

  return data && data.length > 0 ? Number(data[0].id) + 1 : 1;
};

export const getBoardPosts = async (page: number, limit: number) => {
  const supabase = supabaseServer();
  if (!supabase) throw new Error("Failed to create the server client instance.");

  const from = page * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("board")
    .select("id, created_at, content", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  const posts = (data ?? []).map((row) => {
    const post = toBoardPost(row);
    return toBoardPostListItem(post);
  });
  const total = count ?? 0;
  const hasMore = from + limit < total;

  return {
    posts,
    hasMore,
    nextPage: hasMore ? page + 1 : undefined,
  };
};

export const getBoardPostById = async (id: number) => {
  const supabase = supabaseServer();
  if (!supabase) throw new Error("Failed to create the server client instance.");

  const { data, error } = await supabase
    .from("board")
    .select("id, created_at, content")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return toBoardPost(data);
};

export const getBoardRelatedPosts = async (
  postId: number,
  count = 5,
): Promise<BoardPostSummary[]> => {
  const supabase = supabaseServer();
  if (!supabase) throw new Error("Failed to create the server client instance.");

  const { data, error } = await supabase
    .from("board")
    .select("id, created_at, content")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const posts = (data ?? []).map((row) => toBoardPost(row));
  const index = posts.findIndex((post) => Number(post.id) === postId);
  if (index === -1) return [];

  const above = posts.slice(0, index);
  const below = posts.slice(index + 1);
  const aboveCount = Math.min(Math.ceil(count / 2), above.length);
  const belowCount = Math.min(count - aboveCount, below.length);
  const remainingAbove = Math.min(
    count - belowCount - aboveCount,
    above.length - aboveCount,
  );

  const fromAbove = above.slice(-(aboveCount + remainingAbove));
  const fromBelow = below.slice(0, belowCount);

  return [...fromAbove, ...fromBelow].map((post) => ({
    id: post.id,
    title: post.title,
  }));
};
