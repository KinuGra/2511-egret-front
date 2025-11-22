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
import { useWebSocket } from "@/hooks/useWebSocket";
import { PlanetaryComparison } from "@/app/profile/components/ComparePlanet";
import { getSnippet } from "@/lib/firestore/getSnippet";

export default function ProfileScreen() {
  const [snippets, setSnippets] = useState<any[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [notification, setNotification] = useState<{
    title: string;
    content: string;
    snippetScore: number;
  } | null>(null);
  const [scorePopup, setScorePopup] = useState<ScoreSummary | null>(null);

  // スニペットを読み込む
  async function loadSnippet() {
    const docs = await getSnippet();
    setSnippets(docs);
  }
  const { sendMessage } = useWebSocket({
    url: "wss://etuqhxwxk1.execute-api.ap-northeast-1.amazonaws.com/Prod/",
    onMessage: (data) => {
      setNotification(data);
      loadSnippet();
    },
  });
  const scores: [number, number, number] = [100000, 1000, 10030];

  useEffect(() => {
    loadSnippet();
  }, []);

  return (
    <>
      {notification && (
        <Notification
          title={notification.title}
          content={notification.content}
          snippetScore={notification.snippetScore}
          onClose={() => setNotification(null)}
        />
      )}
      <div style={{ backgroundColor: "#efefef" }}>
        <PlanetaryComparison score={scores} />
        <EngineerComparisonProgress comparison={topEngineerData} />
        <EngineerComparisonProgress comparison={surroundingEngineerData} />
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
