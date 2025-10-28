"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Pause } from "lucide-react";
import { MorphSurface } from "@/components/smoothui/ui/AiInput";
import { useRecordings } from "@/hooks/use-recordings";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { addRecording, unreadCount } = useRecordings();

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setAudioUrl(null);
  };

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

        setAudioUrl(data.r2_url);
      }
    } catch (error) {
      console.error("Error generating speech:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    const cleanup = () => {
      setIsPlaying(false);
      setAudioUrl(null);
      audioRef.current = null;
    };

    audio.onended = cleanup;
    audio.onerror = cleanup;

    audio.play()
      .then(() => setIsPlaying(true))
      .catch(cleanup);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl]);

  const customOrb = isPlaying ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleStop}
      className="h-8 w-8 p-0 rounded-full hover:bg-muted/50"
    >
      <Pause size={16} />
    </Button>
  ) : (
    <Image
      src="/srb.webp"
      alt="orb"
      className="rounded-full object-cover"
      width={32}
      height={32}
      style={{ width: '32px', height: '32px' }}
    />
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-4">
              <Link
                href="/recordings"
                className="flex items-center border p-2 rounded-md gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <span className={`h-2 w-2 rounded-full ${unreadCount > 0 ? 'bg-red-500' : 'bg-white'}`} />
                <span>View Recordings</span>
                {unreadCount > 0 && `(${unreadCount})`}
              </Link>
            </div>
          </div>
        </div>
      </div>
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
            customOrb={customOrb}
          />
        </div>
      </div>
    </div>
  );
}