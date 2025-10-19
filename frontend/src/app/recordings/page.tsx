"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRecordings } from "@/hooks/use-recordings";
import { Play, ArrowLeft } from "lucide-react";
import { RecordingItem } from "@/components/recording-item";

function EmptyState() {
    return (
        <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Play size={24} className="text-muted-foreground" />
            </div>
            <h2 className="text-xl text-muted-foreground font-semibold mb-2">No recordings yet</h2>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Loading recordings...</p>
            </div>
        </div>
    );
}

export default function RecordingsPage() {
    const { recordings, isLoading, deleteRecording, markAllAsRead } = useRecordings();
    const [playingId, setPlayingId] = useState<string | null>(null);

    useEffect(() => {
        markAllAsRead();
    }, [markAllAsRead]);

    const handlePlay = (id: string) => {
        setPlayingId(current => current === id ? null : id);
    };

    if (isLoading) return <LoadingState />;

    return (
        <div className="min-h-screen bg-background">
            <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </Link>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {recordings.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="space-y-4">
                        {recordings.map((recording) => (
                            <RecordingItem
                                key={recording.id}
                                recording={recording}
                                isPlaying={playingId === recording.id}
                                onPlay={() => handlePlay(recording.id)}
                                onDelete={() => deleteRecording(recording.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}