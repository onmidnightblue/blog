import { supabaseServer } from "./supabase";
import { toProject } from "../utils/project-content";

export const getNextProjectId = async () => {
  const supabase = supabaseServer();
  if (!supabase) throw new Error("Failed to create the server client instance.");

  const { data, error } = await supabase
    .from("project")
    .select("id")
    .order("id", { ascending: false })
    .limit(1);

  if (error) throw error;

  return data && data.length > 0 ? Number(data[0].id) + 1 : 1;
};

export const getProjects = async (page: number, limit: number) => {
  const supabase = supabaseServer();
  if (!supabase) throw new Error("Failed to create the server client instance.");

  const from = page * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("project")
    .select("id, created_at, content", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  const projects = (data ?? []).map(toProject);
  const total = count ?? 0;
  const hasMore = from + limit < total;

  return {
    projects,
    hasMore,
    nextPage: hasMore ? page + 1 : undefined,
  };
};

export const getProjectById = async (id: number) => {
  const supabase = supabaseServer();
  if (!supabase) throw new Error("Failed to create the server client instance.");

  const { data, error } = await supabase
    .from("project")
    .select("id, created_at, content")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return toProject(data);
};
