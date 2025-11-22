export const sendSnippetToWebSocket = (
	sendMessage: (data: any) => void,
	title: string,
	content: string
) => {
	const payload = {
		title,
		content,
		snippetScore: 50,
	};
	sendMessage(payload);
};
