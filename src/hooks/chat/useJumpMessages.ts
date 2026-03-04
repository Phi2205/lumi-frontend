import { useCallback, useEffect, useRef, useState } from "react";
import { MessageUI } from "@/components/messages/ChatWindow";
import { useAuth } from "@/contexts/AuthContext";
import { getMessageAroundService, getMessageNewerService, getMessageOlderService } from "@/services/conversation.service";

// Helper function to map API message to MessageUI (duplicated for now, could be shared)
const mapMessageToUI = (m: any, currentUserId: string): MessageUI => {
    const date = new Date(m.created_at);
    const isToday = date.toDateString() === new Date().toDateString();
    const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const dateStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });

    return {
        id: m.id,
        sender: m.sender?.name || m.sender?.username || "Unknown",
        senderAvatar: m.sender?.avatar_url || "/avatar-default.jpg",
        content: m.content,
        timestamp: isToday ? time : `${dateStr} ${time}`,
        isOwn: m.sender?.id === currentUserId || m.sender_id === currentUserId,
        attachments: m.attachments
    };
};

export const useJumpMessages = (conversationId?: string, targetMessageId?: string | null) => {
    const { user } = useAuth();
    const abortRef = useRef<AbortController | null>(null);

    const [messages, setMessages] = useState<MessageUI[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMoreAbove, setHasMoreAbove] = useState(false);
    const [hasMoreBelow, setHasMoreBelow] = useState(false);
    const [loadingAbove, setLoadingAbove] = useState(false);
    const [loadingBelow, setLoadingBelow] = useState(false);

    const isFetchingAbove = useRef(false);
    const isFetchingBelow = useRef(false);
    const isFetchingAround = useRef(false);

    useEffect(() => {
        console.log("targetMessageId: ", targetMessageId)
        console.log("message: ", messages)
        console.log("hasMoreAbove: ", hasMoreAbove)
        console.log("hasMoreBelow: ", hasMoreBelow)
    }, [targetMessageId, messages])

    const loadAround = useCallback(async () => {
        if (!conversationId || !user || !targetMessageId || isFetchingAround.current) return;

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);
        isFetchingAround.current = true;
        try {
            const result = await getMessageAroundService(conversationId, targetMessageId, "20");

            if (result && result.success && result.data) {
                const incoming: MessageUI[] = (result.data.items || []).map((m: any) => mapMessageToUI(m, user.id));
                setMessages(incoming);
                setHasMoreAbove(result.data.hasMoreAbove);
                setHasMoreBelow(result.data.hasMoreBelow);
            }
        } catch (err: any) {
            if (err.name !== "AbortError") console.error(err);
        } finally {
            setLoading(false);
            isFetchingAround.current = false;
        }
    }, [conversationId, user, targetMessageId]);

    useEffect(() => {
        if (targetMessageId) {
            loadAround();
        } else {
            setMessages([]);
            setHasMoreAbove(false);
            setHasMoreBelow(false);
            setLoadingAbove(false);
            setLoadingBelow(false);
        }
        return () => abortRef.current?.abort();
    }, [targetMessageId, loadAround]);

    const loadMoreAbove = useCallback(async () => {
        if (!conversationId || !user || isFetchingAbove.current || !hasMoreAbove) return;
        const oldestId = messages[messages.length - 1]?.id;
        if (!oldestId) return;

        setLoadingAbove(true);
        isFetchingAbove.current = true;
        try {
            const result = await getMessageOlderService(conversationId, oldestId, 20);

            if (result && result.success && result.data) {
                const incoming: MessageUI[] = (result.data.items || []).map((m: any) => mapMessageToUI(m, user.id));

                setMessages(prev => {
                    const merged = [...prev, ...incoming];
                    return Array.from(new Map(merged.map(m => [m.id, m])).values());
                });
                setHasMoreAbove(result.data.hasMore);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingAbove(false);
            isFetchingAbove.current = false;
        }
    }, [conversationId, user, hasMoreAbove, messages]);

    const loadMoreBelow = useCallback(async () => {
        if (!conversationId || !user || isFetchingBelow.current || !hasMoreBelow) return;

        const newestId = messages[0]?.id;
        if (!newestId) return;
        console.log("newestId: ", newestId)
        console.log("messages: ", messages)

        setLoadingBelow(true);
        isFetchingBelow.current = true;
        try {
            const result = await getMessageNewerService(conversationId, newestId, 20);

            if (result && result.success && result.data) {
                const incoming: MessageUI[] = (result.data.items || []).map((m: any) => mapMessageToUI(m, user.id));

                setMessages(prev => {
                    const merged = [...incoming, ...prev];
                    return Array.from(new Map(merged.map(m => [m.id, m])).values());
                });
                setHasMoreBelow(result.data.hasMore);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingBelow(false);
            isFetchingBelow.current = false;
        }
    }, [conversationId, user, hasMoreBelow, messages]);

    return {
        messages,
        loading,
        loadingAbove,
        loadingBelow,
        hasMoreAbove,
        hasMoreBelow,
        loadMoreAbove,
        loadMoreBelow,
        refresh: loadAround
    };
};
