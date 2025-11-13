import { Snippet } from "@/types/snippet";
import SnippetCard from "./components/SnippetCard";

export default function ProfileScreen() {
	const data: Snippet[] = [
		{
			id: 1,
			title: "C言語のprintf",
			content: `
# 基本的な書き方
\`\`\`c
printf("hello, %d", 100);
\`\`\`
## フォーマット指定子
%c : char  
%d int, short
%u unsigned int, unsigned short
`,
		},
		{
			id: 2,
			title: "JavaScriptの変数宣言",
			content: `
\`\`\`javascript
let hoge = 100;
\`\`\`
`,
		},
		{
			id: 3,
			content: `
PRを出したら自動でGeminiがコードレビューをしてくれるようにすることもできる
`,
		},
	];

	return (
		<>
			<div style={{ backgroundColor: "#efefef" }}>
				{data.map((snippet) => (
					<div key={snippet.id}>
						<SnippetCard
							id={snippet.id}
							title={snippet.title}
							content={snippet.content}
						/>
					</div>
				))}
			</div>
		</>
	);
}
