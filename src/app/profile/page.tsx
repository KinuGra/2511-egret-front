"use client";

import { useEffect, useState } from "react";
import { Snippet } from "@/types/snippet";
import SnippetCard from "./components/SnippetCard";
import EngineerComparisonProgress from "./components/EngineerComparisonProgress";
import EditButton from "./components/EditButton";
import EditForm from "./components/EditForm";
import Notification from "./components/Notification";
import { useWebSocket } from "@/hooks/useWebSocket";
import { getSnippet } from "@/lib/firestore/getSnippet";

export default function ProfileScreen() {
  const [snippets, setSnippets] = useState<any[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [notification, setNotification] = useState<{
    title: string;
    content: string;
    snippetScore: number;
  } | null>(null);

  // スニペットを読み込む
  async function loadSnippet() {
    const docs = await getSnippet();
    setSnippets(docs);
  }

  const { sendMessage } = useWebSocket({
    url: "wss://0azgrfwv7j.execute-api.ap-northeast-1.amazonaws.com/Prod/",
    onMessage: (data) => {
      setNotification(data);
      loadSnippet();
    },
  });

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
        <EngineerComparisonProgress comparison={topEngineerData} />
        <EngineerComparisonProgress comparison={surroundingEngineerData} />
        {snippets.length > 0
          ? snippets.map((snippet, index) => (
              <div key={snippet.id}>
                <SnippetCard
                  id={snippet.id}
                  title={snippet.data.title}
                  content={snippet.data.content}
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
      />
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
