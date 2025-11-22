"use client";

import React, { useState } from "react";

const API_URL = "/api/proxy"; // proxy through Next.js server to avoid CORS

export default function Page() {
  const [index, setIndex] = useState("TypeScriptでサーバーを作成しました");
  const [indexvalue, setIndexvalue] = useState<number>(32);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index, indexvalue }),
      });

      const data = await res.json();
      // data should be { status, ok, body } from the proxy
      setResult(data);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: 24,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      }}
    >
      <h1>API 動作確認 (POST)</h1>
      <p>
        エンドポイント: <code>{API_URL}</code>
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: 12, maxWidth: 640 }}
      >
        <label>
          index
          <input
            type="text"
            value={index}
            onChange={(e) => setIndex(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label>
          indexvalue
          <input
            type="number"
            value={indexvalue}
            onChange={(e) => setIndexvalue(Number(e.target.value))}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <div>
          <button
            type="submit"
            disabled={loading}
            style={{ padding: "8px 16px" }}
          >
            {loading ? "送信中…" : "送信 (POST)"}
          </button>
        </div>
      </form>

      <section style={{ marginTop: 20 }}>
        <h2>レスポンス</h2>
        {error && (
          <div style={{ color: "#b00020" }}>
            <strong>エラー:</strong> {error}
          </div>
        )}

        {result && (
          <div>
            <div>
              <strong>HTTP Status:</strong> {result.status}{" "}
              {result.ok ? "(OK)" : "(NG)"}
            </div>
            <div style={{ marginTop: 8 }}>
              <strong>Body:</strong>
              <pre
                style={{
                  background: "#f6f8fa",
                  padding: 12,
                  whiteSpace: "pre-wrap",
                }}
              >
                {JSON.stringify(result.body, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {!result && !error && (
          <div>
            まだ送信されていません。フォームに値を入れて送信してください。
          </div>
        )}
      </section>
    </div>
  );
}
