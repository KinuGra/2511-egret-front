import { useEffect, useRef } from "react";

interface UseWebSocketOptions {
	url: string;
	onMessage: (data: any) => void;
}

export const useWebSocket = ({ url, onMessage }: UseWebSocketOptions) => {
	const ws = useRef<WebSocket | null>(null);
	const onMessageRef = useRef(onMessage);

	// Keep the latest onMessage callback in ref
	useEffect(() => {
		onMessageRef.current = onMessage;
	}, [onMessage]);

	useEffect(() => {
		ws.current = new WebSocket(url);

		ws.current.onopen = () => {
			console.log("WebSocket Connected");
		};

		ws.current.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				onMessageRef.current(data); // Use ref to always get the latest callback
			} catch (error) {
				console.error("Failed to parse WebSocket message:", error);
			}
		};

		ws.current.onerror = (error) => {
			console.error("WebSocket Error:", error);
		};

		ws.current.onclose = () => {
			console.log("WebSocket Disconnected");
		};

		return () => {
			ws.current?.close();
		};
	}, [url]); // Removed onMessage from dependencies

	const sendMessage = (data: any) => {
		if (ws.current && ws.current.readyState === WebSocket.OPEN) {
			ws.current.send(JSON.stringify(data));
		} else {
			console.error("WebSocket is not connected");
		}
	};

	return { sendMessage };
};
