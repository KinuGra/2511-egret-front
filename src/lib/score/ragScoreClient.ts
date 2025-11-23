export async function scoreSnippet(title: string | null, content: string, byte_length: number) {

  const res = await fetch("http://localhost:8000/score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      content,
      byte_length: byte_length,
    }),
  });

  if (!res.ok) {
    throw new Error("スコアリングAPIの呼び出しに失敗しました");
  }

  return res.json();
}
