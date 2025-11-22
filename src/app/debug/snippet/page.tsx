"use client";

import React, { useEffect, useState } from "react";
import { getSnippet } from "@/lib/firestore/getSnippet";

export default function DebugPage() {
  const [snippets, setSnippets] = useState<{ id: string; data: any }[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await getSnippet();
      setSnippets(res ?? []);
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Firestore getSnippet Debug</h1>
      <p>
        This page calls <code>getSnippet()</code> and displays the returned
        documents.
      </p>
      <div style={{ margin: "12px 0" }}>
        <button onClick={load} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div style={{ color: "red" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <pre style={{ background: "#f6f8fa", padding: 12, borderRadius: 6 }}>
        {snippets ? JSON.stringify(snippets, null, 2) : "No data loaded."}
      </pre>
    </div>
  );
}
