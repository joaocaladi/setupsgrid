import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatória"),
  DIRECT_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL deve ser uma URL válida"),
  SUPABASE_SERVICE_KEY: z.string().min(1, "SUPABASE_SERVICE_KEY é obrigatória"),
  ADMIN_EMAIL: z.string().email("ADMIN_EMAIL deve ser um email válido"),
  ADMIN_PASSWORD: z.string().min(8, "ADMIN_PASSWORD deve ter pelo menos 8 caracteres").optional(),
  ADMIN_PASSWORD_HASH: z.string().optional(),
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET deve ter pelo menos 32 caracteres"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  USE_MOCK: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

let validatedEnv: Env | null = null;

export function validateEnv(): Env {
  if (validatedEnv) {
    return validatedEnv;
  }

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    if (process.env.NODE_ENV === "production") {
      throw new Error(`Variáveis de ambiente inválidas:\n${errors}`);
    } else {
      console.warn("⚠️ Variáveis de ambiente com problemas:\n", errors);
    }
  }

  validatedEnv = result.data as Env;
  return validatedEnv;
}

export function getEnv<K extends keyof Env>(key: K): Env[K] {
  const env = validateEnv();
  return env[key];
}
