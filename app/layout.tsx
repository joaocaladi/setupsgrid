import type { Metadata } from "next";
import { ThemeProvider } from "@/components";
import "./globals.css";

export const metadata: Metadata = {
  title: "SetupsGrid - Inspiração para seu Setup",
  description:
    "Descubra setups incríveis e encontre os produtos perfeitos para montar seu workspace dos sonhos.",
  keywords: ["setup", "workspace", "desk setup", "home office", "inspiração"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
