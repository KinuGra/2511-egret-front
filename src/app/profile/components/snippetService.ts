export const sendSnippetToWebSocket = (
	sendMessage: (data: any) => void,
	title: string,
	content: string,
	finalScore: number,
) => {
	const payload = {
		title,
		content,
		snippetScore: finalScore,
	};
	sendMessage(payload);
};
