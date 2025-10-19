"use client";

import React, { useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlayAudioProps {
    audioUrl?: string;
    isPlaying?: boolean;
    onPlayingChange?: (isPlaying: boolean) => void;
    disabled?: boolean;
    className?: string;
    size?: "sm" | "md" | "lg";
    variant?: "button" | "icon" | "outline";
    showText?: boolean;
}

const SIZE_CONFIG = {
    sm: { class: "h-6 w-6", icon: 12, button: "sm" as const },
    md: { class: "h-8 w-8", icon: 14, button: "default" as const },
    lg: { class: "h-10 w-10", icon: 16, button: "lg" as const }
};

export function PlayAudio({
    audioUrl,
    isPlaying = false,
    onPlayingChange,
    disabled = false,
    className = "",
    size = "md",
    variant = "icon",
    showText = false,
}: PlayAudioProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const config = SIZE_CONFIG[size];

    useEffect(() => {
        if (!audioUrl) return;

        if (isPlaying && !audioRef.current) {
            const audio = new Audio(audioUrl);
            audioRef.current = audio;

            audio.onended = () => {
                audioRef.current = null;
                onPlayingChange?.(false);
            };

            audio.onerror = () => {
                audioRef.current = null;
                onPlayingChange?.(false);
            };

            audio.play().catch(() => {
                audioRef.current = null;
                onPlayingChange?.(false);
            });
        } else if (!isPlaying && audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
    }, [isPlaying, audioUrl, onPlayingChange]);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const handleClick = () => {
        if (!audioUrl || disabled) return;
        onPlayingChange?.(!isPlaying);
    };

    if (!audioUrl) return null;

    const Icon = isPlaying ? Pause : Play;
    const text = isPlaying ? "Stop" : "Play";

    if (variant === "button" || variant === "outline") {
        return (
            <Button
                onClick={handleClick}
                disabled={disabled}
                size={config.button}
                variant={variant === "outline" ? "outline" : "default"}
                className={className}
            >
                <Icon size={config.icon} />
                {showText && <span className="ml-1">{text}</span>}
            </Button>
        );
    }

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className={`flex items-center justify-center rounded-full bg-foreground text-background hover:bg-foreground/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${config.class} ${className}`}
            aria-label={`${text} audio`}
        >
            <Icon size={config.icon} className="ml-0.5" />
        </button>
    );
}