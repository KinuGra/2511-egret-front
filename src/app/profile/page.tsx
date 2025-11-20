import { Snippet } from "@/types/snippet";
import SnippetCard from "./components/SnippetCard";
import EngineerComparisonProgress from "./components/EngineerComparisonProgress";

export default function ProfileScreen() {
	return (
		<>
			<div style={{ backgroundColor: "#efefef" }}>
				<EngineerComparisonProgress comparison={topEngineerData} />
				<EngineerComparisonProgress comparison={surroundingEngineerData} />

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
- %c : char  
- %d int, short
- %u unsigned int, unsigned short
---

`,
	},
	{
		id: 2,
		title: "JavaScriptの変数宣言",
		content: `
\`\`\`javascript
let hoge = 100;
console.log("hoge");
\`\`\`

\`const name = "Mary"\`
`,
	},
	{
		id: 3,
		content: `
PRを出したら自動でGeminiがコードレビューをしてくれるようにすることもできる
`,
	},
	{
		id: 4,
		title: "FastAPIの基本",
		content: `
# FastAPI の特徴

| 機能 | 説明 |
|------|------|
| 超高速 | Starlette + Pydantic により高速に動作 |
| 型安全 | Python の型ヒントで自動バリデーション |
| 自動ドキュメント | Swagger UI と ReDoc が自動生成 |
| 非同期に対応 | async/await に完全対応 |

## 最小のサンプル

\`\`\`python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello FastAPI"}
\`\`\`

## ルーティング

\`\`\`python
@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}
\`\`\`

---
`,
	},
];

const topEngineerData = {
	title: "VS 活躍する学生",
	myScore: 650,
	targetScore: 800,
	colorCode: "red",
};
const surroundingEngineerData = {
	title: "VS 他プレイヤー",
	myScore: 500,
	targetScore: 550,
	colorCode: "orange",
};
