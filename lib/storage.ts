import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (supabase) return supabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase credentials not configured");
  }

  supabase = createClient(supabaseUrl, supabaseServiceKey);
  return supabase;
}

export type StorageBucket = "setups" | "produtos" | "setup-submissions";

export async function uploadImage(
  file: File,
  bucket: StorageBucket
): Promise<string> {
  const client = getSupabase();
  const ext = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${ext}`;

  const { error } = await client.storage.from(bucket).upload(fileName, file, {
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) {
    console.error("Erro ao fazer upload:", error);
    throw new Error("Erro ao fazer upload da imagem");
  }

  const { data } = client.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}

export async function deleteImage(url: string, bucket: StorageBucket) {
  const client = getSupabase();
  const fileName = url.split("/").pop();
  if (!fileName) return;

  const { error } = await client.storage.from(bucket).remove([fileName]);
  if (error) {
    console.error("Erro ao deletar imagem:", error);
  }
}

export async function uploadSubmissionImage(
  file: File,
  submissionId: string
): Promise<string> {
  const client = getSupabase();
  const ext = file.name.split(".").pop();
  const fileName = `submissions/${submissionId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await client.storage
    .from("setup-submissions")
    .upload(fileName, file, {
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) {
    console.error("Erro ao fazer upload:", error);
    throw new Error("Erro ao fazer upload da imagem");
  }

  const { data } = client.storage
    .from("setup-submissions")
    .getPublicUrl(fileName);
  return data.publicUrl;
}
