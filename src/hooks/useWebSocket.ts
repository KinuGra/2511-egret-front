import { useEffect, useRef } from "react";

interface UseWebSocketOptions {
	url: string;
	onMessage: (data: any) => void;
}

export const useWebSocket = ({ url, onMessage }: UseWebSocketOptions) => {
	const ws = useRef<WebSocket | null>(null);

	useEffect(() => {
		ws.current = new WebSocket(url);

		ws.current.onopen = () => {
			console.log("WebSocket Connected");
		};

		ws.current.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				onMessage(data);
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
	}, [url, onMessage]);

	const sendMessage = (data: any) => {
		if (ws.current && ws.current.readyState === WebSocket.OPEN) {
			ws.current.send(JSON.stringify(data));
		} else {
			console.error("WebSocket is not connected");
		}
	};

	return { sendMessage };
};
