import type { Metadata } from "next";
import { ThemeProvider } from "@/components";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gridiz - Inspiração para seu Setup",
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || theme === 'light') {
                    document.documentElement.setAttribute('data-theme', theme);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
