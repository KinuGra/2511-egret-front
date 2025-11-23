"use client";

import { useEffect, useState } from "react";
import { Snippet } from "@/types/snippet";
import SnippetCard from "./components/SnippetCard";
import EngineerComparisonProgress from "./components/EngineerComparisonProgress";
import EditButton from "./components/EditButton";
import EditForm from "./components/EditForm";
import ScoreResultPopup from "./components/ScoreResultPopup";
import { ScoreSummary } from "@/lib/score/fetchScoreFromAWS";
import Notification from "./components/Notification";
import WarningPopup from "./components/WarningPopup";
import { useWebSocket } from "@/hooks/useWebSocket";
import { PlanetaryComparison } from "@/app/profile/components/ComparePlanet";
import { getSnippet } from "@/lib/firestore/getSnippet";
import otherPlayerScores from "@/data/otherPlayers";

export default function ProfileScreen() {
  const [snippets, setSnippets] = useState<any[]>([]);
  const [myTotalScore, setMyTotalScore] = useState<number>(0);
  const [isFormVisible, setIsFormVisible] = useState(false);
  // Notification data with optional type for message classification
  const [notification, setNotification] = useState<{
    type?: string;
    title: string;
    content: string;
    snippetScore: number;
  } | null>(null);
  const [scorePopup, setScorePopup] = useState<ScoreSummary | null>(null);
  const [showWarning, setShowWarning] = useState<boolean>(false);

  // スニペットを読み込む
  async function loadSnippet() {
    const docs = await getSnippet();
    setSnippets(docs);
    // Firestore の snippetScore を合算して自分の総スコアを求める
    const total = docs.reduce((acc: number, doc: any) => {
      const s = Number(doc.data?.snippetScore ?? doc.data?.snippet_score ?? 0);
      return acc + (Number.isFinite(s) ? s : 0);
    }, 0);
    setMyTotalScore(total);
  }
  const { sendMessage } = useWebSocket({
    url: "wss://etuqhxwxk1.execute-api.ap-northeast-1.amazonaws.com/Prod/",
    onMessage: (data) => {
      if (data.type === "send_confirmation") {
        // Send confirmation message
        setNotification({
          type: "send_confirmation",
          title: "✓",
          content: data.message || "送信できました",
          snippetScore: data.snippetScore || 0, // Use score from server if available
        });
      } else {
        // Other player's post
        setNotification(data);
        loadSnippet();
      }
    },
  });
  // PlanetaryComparison に渡すスコア配列
  // [あなたのスコア, 活躍するエンジニアのスコア, 他プレイヤーの平均スコア]
  const surroundingAvg =
    otherPlayerScores.length > 0
      ? Math.round(
          otherPlayerScores.reduce((a, b) => a + b, 0) /
            otherPlayerScores.length
        )
      : 0;
  // 目標スコアは固定（変化しない）
  const TOP_TARGET_SCORE = 5200; // 活躍するエンジニアの目標を 5200 に固定
  // 他プレイヤーの目標は otherPlayers の平均点を使用
  const SURROUNDING_TARGET_SCORE = surroundingAvg;

  const scores: [number, number, number] = [
    myTotalScore,
    TOP_TARGET_SCORE,
    surroundingAvg,
  ];

  useEffect(() => {
    loadSnippet();
    // 起動/リロード時に警告ポップアップを表示
    setShowWarning(true);
  }, []);

  // 遅れ（percent）はプログレスバーと同じ計算を使う
  const computeDelayPercent = (myScore: number, target: number) => {
    if (!target || target <= 0) return 0;
    const rawPercentage = (myScore / target) * 100;
    const delay = Math.max(0, 100 - rawPercentage);
    return Math.round(delay);
  };

  const percentToTop = computeDelayPercent(myTotalScore, TOP_TARGET_SCORE);
  const percentToSurrounding = computeDelayPercent(
    myTotalScore,
    SURROUNDING_TARGET_SCORE
  );
  // 学習遅延の点数は「活躍するエンジニアの目標点 - 自分のスコア」
  const delayPointsToTop = Math.max(0, TOP_TARGET_SCORE - myTotalScore);

  return (
    <>
      {notification && (
        <Notification
          title={notification.title}
          content={notification.content}
          snippetScore={notification.snippetScore}
          label={
            notification.type === "send_confirmation"
              ? "送信できました"
              : "他プレイヤーの投稿"
          }
          onClose={() => setNotification(null)}
        />
      )}
      <div style={{ backgroundColor: "#efefef" }}>
        <WarningPopup
          open={showWarning}
          // 表示する遅れの点数は目標 - 自分のスコア
          score={delayPointsToTop}
          percent1={percentToTop}
          percent2={percentToSurrounding}
          onClose={() => setShowWarning(false)}
        />
        <PlanetaryComparison score={scores} />
        {/* Responsive spacer */}
        <div className="h-4 md:h-8 lg:h-12" />
        <EngineerComparisonProgress
          comparison={{
            title: "VS 活躍するエンジニア",
            // My Score は Firestore の合算値を使う（両方とも同じ値）
            myScore: myTotalScore,
            targetScore: TOP_TARGET_SCORE,
            colorCode: "red",
          }}
        />
        <EngineerComparisonProgress
          comparison={{
            title: "VS 他プレイヤー",
            // こちらも My Score を自分の合算値に合わせる
            myScore: myTotalScore,
            targetScore: SURROUNDING_TARGET_SCORE,
            colorCode: "orange",
          }}
        />
        {snippets.length > 0
          ? snippets.map((snippet, index) => (
              <div key={snippet.id}>
                <SnippetCard
                  id={snippet.id}
                  title={snippet.data.title}
                  content={snippet.data.content}
                  scoreFromAWS={snippet.data.snippetScore}
                />
              </div>
            ))
          : "No data loaded."}
      </div>
      <EditButton onClick={() => setIsFormVisible(true)} />
      <EditForm
        isOpen={isFormVisible}
        onClose={() => setIsFormVisible(false)}
        sendMessage={sendMessage}
        loadSnippet={loadSnippet}
        onShowScore={(s: ScoreSummary) => setScorePopup(s)}
      />
      {scorePopup && (
        <ScoreResultPopup
          open={true}
          summary={scorePopup}
          onClose={() => setScorePopup(null)}
          posting={false}
          posted={true}
        />
      )}
    </>
  );
}

const topEngineerData = {
  title: "VS 活躍するエンジニア",
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
