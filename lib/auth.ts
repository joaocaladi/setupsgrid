import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 12;

function getSecret() {
  const authSecret = process.env.AUTH_SECRET;
  if (!authSecret) {
    throw new Error("AUTH_SECRET não está configurado");
  }
  return new TextEncoder().encode(authSecret);
}

export const secret = getSecret();

export async function createSession(email: string) {
  const jti = crypto.randomUUID();
  const token = await new SignJWT({ email, jti })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("4h")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 4, // 4 hours
  });
}

export async function verifySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function validateCredentials(
  email: string,
  password: string
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail) {
    await hashPassword(password);
    return false;
  }

  if (email !== adminEmail) {
    await hashPassword(password);
    return false;
  }

  // Usar hash se disponível
  if (adminPasswordHash) {
    return verifyPassword(password, adminPasswordHash);
  }

  // Fallback para texto plano (apenas em desenvolvimento)
  if (adminPassword && process.env.NODE_ENV !== "production") {
    return password === adminPassword;
  }

  await hashPassword(password);
  return false;
}

export async function generatePasswordHash(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}
