"use client";
import { useState } from "react";
import { MorphSurface } from "@/components/smoothui/ui/AiInput";
import { useRecordings } from "@/hooks/use-recordings";
import Link from "next/link";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const { addRecording, unreadCount } = useRecordings();

  const handleSend = async (text: string) => {
    setIsLoading(true);
    const startTime = Date.now();

    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (data.r2_url) {
        const endTime = Date.now();
        const latency = endTime - startTime;

        addRecording({
          text: text,
          r2_url: data.r2_url,
          latency: latency,
        });
      }

      // Simulate API call with mock data
      // setTimeout(() => {
      //   setAudioUrl("https://cdn.aihead.me/generated-audio/2ce1f745-4164-4e04-bc4d-b0ea75b74660.mp3");
      //   setIsLoading(false);
      // }, 10000);

    } catch (error) {
      console.error("Error generating speech:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background ">
      < div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10" >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-4">
              <Link
                href="/recordings"
                className="flex items-center border p-2 rounded-md gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                View Recordings {unreadCount > 0 && `(${unreadCount})`}
              </Link>
            </div>
          </div>
        </div>
      </div >
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">

        <div className="absolute inset-0 z-0 mt-40" style={{
          backgroundImage: `
        linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
      `,
          backgroundSize: "40px 40px",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)",
          maskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)",
        }}
        />

        <div className="relative">
          <MorphSurface
            onSend={handleSend}
            isLoading={isLoading}
          />
        </div>
      </div >
    </div >
  );
}