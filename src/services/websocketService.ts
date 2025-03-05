// src/services/websocketService.ts
import { useEffect, useRef, useState, useCallback } from 'react';

type MessageHandler = (message: any) => void;
type WebSocketStatus = 'connecting' | 'connected' | 'disconnected';

interface WebSocketMessage {
    type: string;
    [key: string]: any;
}

export const useWebSocket = (documentId: string) => {
    const [status, setStatus] = useState<WebSocketStatus>('disconnected');
    const [error, setError] = useState<string | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const messageHandlersRef = useRef<Record<string, MessageHandler[]>>({});
    const reconnectTimeoutRef = useRef<number | null>(null);
    const pingIntervalRef = useRef<number | null>(null);
    const lastPingRef = useRef<number>(0);

    // Initialize WebSocket connection
    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) return;

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setError('Authentication required');
                return;
            }

            const wsUrl = `${import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8080'}/ws/documents/${documentId}?token=${token}`;
            setStatus('connecting');

            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                setStatus('connected');
                setError(null);

                // Subscribe to document
                sendMessage({
                    type: 'subscribe',
                    document_id: documentId
                });

                // Set up ping interval
                if (pingIntervalRef.current) {
                    clearInterval(pingIntervalRef.current);
                }
                pingIntervalRef.current = window.setInterval(() => {
                    if (wsRef.current?.readyState === WebSocket.OPEN) {
                        sendMessage({ type: 'ping' });
                        lastPingRef.current = Date.now();
                    }
                }, 30000);
            };

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data) as WebSocketMessage;

                    if (message.type === 'pong') {
                        // Handle pong - could log latency here if needed
                        return;
                    }

                    if (message.type === 'error') {
                        setError(message.message || 'Unknown WebSocket error');
                        return;
                    }

                    // Dispatch message to registered handlers
                    if (messageHandlersRef.current[message.type]) {
                        messageHandlersRef.current[message.type].forEach(handler => {
                            try {
                                handler(message);
                            } catch (err) {
                                console.error('Error in message handler:', err);
                            }
                        });
                    }
                } catch (err) {
                    console.error('Failed to parse WebSocket message:', err);
                }
            };

            ws.onerror = () => {
                setError('WebSocket connection error');
                setStatus('disconnected');
            };

            ws.onclose = () => {
                setStatus('disconnected');

                // Clear ping interval
                if (pingIntervalRef.current) {
                    clearInterval(pingIntervalRef.current);
                    pingIntervalRef.current = null;
                }

                // Attempt to reconnect after delay
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                }
                reconnectTimeoutRef.current = window.setTimeout(() => {
                    connect();
                }, 5000);
            };
        } catch (err) {
            setError('Failed to establish WebSocket connection');
            setStatus('disconnected');
        }
    }, [documentId]);

    // Register a message handler
    const onMessage = useCallback((type: string, handler: MessageHandler) => {
        if (!messageHandlersRef.current[type]) {
            messageHandlersRef.current[type] = [];
        }
        messageHandlersRef.current[type].push(handler);

        // Return function to remove this handler
        return () => {
            if (messageHandlersRef.current[type]) {
                messageHandlersRef.current[type] = messageHandlersRef.current[type].filter(h => h !== handler);
            }
        };
    }, []);

    // Send message to WebSocket server
    const sendMessage = useCallback((message: WebSocketMessage) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
            return true;
        }
        return false;
    }, []);

    // Send cursor position update
    const sendCursorPosition = useCallback((position: { line: number; column: number }) => {
        return sendMessage({
            type: 'cursor',
            document_id: documentId,
            position
        });
    }, [documentId, sendMessage]);

    // Send document update
    const sendDocumentUpdate = useCallback((version: number, patches: any[]) => {
        return sendMessage({
            type: 'update',
            document_id: documentId,
            version,
            patches
        });
    }, [documentId, sendMessage]);

    // Connect on mount, disconnect on unmount
    useEffect(() => {
        connect();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }

            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }

            if (pingIntervalRef.current) {
                clearInterval(pingIntervalRef.current);
                pingIntervalRef.current = null;
            }
        };
    }, [connect, documentId]);

    return {
        status,
        error,
        sendMessage,
        onMessage,
        sendCursorPosition,
        sendDocumentUpdate,
        reconnect: connect
    };
};