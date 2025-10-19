"use client";

import { Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlayAudio } from "@/components/play-audio";
import type { Recording } from "@/hooks/use-recordings";

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

interface RecordingItemProps {
    recording: Recording;
    isPlaying: boolean;
    onPlay: () => void;
    onDelete: () => void;
}

export function RecordingItem({ recording, isPlaying, onPlay, onDelete }: RecordingItemProps) {
    const handleDownload = async () => {
        try {
            const response = await fetch(recording.r2_url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${recording.id}.mp3`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download recording:', error);
        }
    };

    return (
        <div className={`bg-card border rounded-lg p-4 transition-colors ${!recording.isRead ? 'border-l-4 border-l-blue-500' : ''}`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm font-medium text-foreground line-clamp-2">
                            {recording.text}
                        </p>
                        {!recording.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{formatDate(recording.createdAt)}</span>
                        <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                        <span className="font-medium text-green-600 dark:text-green-400">
                            {recording.latency || 0} ms
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <PlayAudio
                        audioUrl={recording.r2_url}
                        isPlaying={isPlaying}
                        onPlayingChange={onPlay}
                        variant="outline"
                        size="sm"
                        showText
                    />

                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleDownload}
                        className="hover:bg-accent"
                    >
                        <Download size={14} />
                    </Button>

                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={onDelete}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                        <Trash2 size={14} />
                    </Button>
                </div>
            </div>
        </div>
    );
}

