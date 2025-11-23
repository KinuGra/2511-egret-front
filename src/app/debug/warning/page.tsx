"use client";

import { useState } from "react";
import WarningPopup from "@/app/profile/components/WarningPopup";

export default function WarningDebugPage() {
  const [showWarning, setShowWarning] = useState(false);

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "24px" }}>警告ポップアップ デバッグページ</h1>

      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>トリガーボタン</h2>
        <button
          onClick={() => setShowWarning(true)}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          警告ポップアップを表示
        </button>
      </div>

      <div style={{ marginTop: "32px", padding: "16px", backgroundColor: "#f3f4f6", borderRadius: "8px" }}>
        <h3 style={{ fontSize: "16px", marginBottom: "12px" }}>現在の設定:</h3>
        <ul style={{ lineHeight: "1.8" }}>
          <li>score: 650 (ビハインドポイント)</li>
          <li>percent1: 25 (トップエンジニアとの比較%)</li>
          <li>percent2: 10 (平均エンジニアとの比較%)</li>
        </ul>
      </div>

      <WarningPopup
        open={showWarning}
        score={650}
        percent1={25}
        percent2={10}
        onClose={() => setShowWarning(false)}
      />
    </div>
  );
}
