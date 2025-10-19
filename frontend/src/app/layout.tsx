import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: "Text To Speech",
  description: "Convert text to speech",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="max-w-5xl mx-auto" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
