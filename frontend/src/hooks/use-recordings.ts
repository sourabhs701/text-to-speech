"use client";

import { useState, useEffect, useCallback } from "react";

export interface Recording {
    id: string;
    text: string;
    r2_url: string;
    latency: number;
    isRead: boolean;
    createdAt: string;
}

const STORAGE_KEY = "recordings";

export function useRecordings() {
    const [recordings, setRecordings] = useState<Recording[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsedRecordings = JSON.parse(stored);
                setRecordings(parsedRecordings);
            }
        } catch (error) {
            console.error("Error loading recordings from localStorage:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isLoading) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(recordings));
            } catch (error) {
                console.error("Error saving recordings to localStorage:", error);
            }
        }
    }, [recordings, isLoading]);

    const addRecording = useCallback((recording: Omit<Recording, "id" | "createdAt" | "isRead">) => {
        const newRecording: Recording = {
            ...recording,
            id: crypto.randomUUID(),
            isRead: false,
            createdAt: new Date().toISOString(),
        };

        setRecordings(prev => [newRecording, ...prev]);
        return newRecording;
    }, []);

    const deleteRecording = useCallback((id: string) => {
        setRecordings(prev => prev.filter(recording => recording.id !== id));
    }, []);

    const markAsRead = useCallback((id: string) => {
        setRecordings(prev =>
            prev.map(recording =>
                recording.id === id ? { ...recording, isRead: true } : recording
            )
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setRecordings(prev =>
            prev.map(recording => ({ ...recording, isRead: true }))
        );
    }, []);

    const unreadCount = recordings.filter(recording => !recording.isRead).length;

    const clearRecordings = useCallback(() => {
        setRecordings([]);
    }, []);

    return {
        recordings,
        isLoading,
        unreadCount,
        addRecording,
        deleteRecording,
        markAsRead,
        markAllAsRead,
        clearRecordings,
    };
}
