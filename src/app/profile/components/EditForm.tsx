"use client";

import React, { useEffect, useState } from "react";
import styles from "./EditForm.module.css";
import MarkdownText from "@/components/MarkdownText";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { sendSnippetToWebSocket } from "./snippetService";
import { addSnippet } from "../../../lib/firestore/addSnippet";
import {
  fetchScoreFromAWS,
  computeScoreSummary,
  ScoreSummary,
} from "@/lib/score/fetchScoreFromAWS";
// ScoreResultPopup is managed by parent component

interface EditFormProps {
  isOpen: boolean;
  onClose: () => void;
  sendMessage: (data: any) => void;
  loadSnippet: () => void;
  onShowScore?: (summary: ScoreSummary) => void;
}

type ViewMode = "write" | "preview";

const EditForm: React.FC<EditFormProps> = ({
  isOpen,
  onClose,
  sendMessage,
  loadSnippet,
  onShowScore,
}) => {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("write");
  const [error, setError] = useState("");
  const [scoreSummary, setScoreSummary] = useState<ScoreSummary | null>(null);
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Effect to handle mount/unmount animations
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    } else {
      const timer = setTimeout(() => setIsRendered(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Effect to reset content and view when the form is opened
  useEffect(() => {
    if (isOpen) {
      setContent(
        '## Hello, Markdown!\n\n```javascript\nconsole.log("Hello, World!");\n```'
      );
      setViewMode("write"); // Default to write mode on open
      setError(""); // Reset error on open
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("内容は必須です。入力してください。");
      return;
    }

    // Bedrockによる採点
    const evaluationResult = await fetchScoreFromAWS(content, content.length);
    console.log("evaluationResult: ", evaluationResult);
    // Normalize into UI-friendly summary (handles nulls and rounding)
    const summary = computeScoreSummary(evaluationResult);
    setScoreSummary(summary);
    // 投稿を行い、完了後に親に結果を渡してフォームを閉じる
    await handleConfirmPost(summary);
    if (onShowScore) onShowScore(summary);
    onClose();
  };

  const handleConfirmPost = async (providedSummary?: ScoreSummary | null) => {
    // Use provided summary if available to avoid relying on state update timing
    const s = providedSummary ?? scoreSummary;
    try {
      setPosting(true);
      if (!s) {
        // fallback: zero score
        await sendSnippetToWebSocket(sendMessage, title, content, 0);
        await addSnippet({
          id: Math.floor(Date.now() / 1000),
          title: title,
          content: content,
          snippetScore: 0,
        });
      } else {
        const final = s.finalWeightedScore ?? 0;
        await sendSnippetToWebSocket(sendMessage, title, content, final);
        await addSnippet({
          id: Math.floor(Date.now() / 1000),
          title: title,
          content: content,
          snippetScore: final,
        });
      }
      await loadSnippet();
      setPosted(true);
      // 投稿完了後は親に表示を委ねるため、外部でポップアップを表示してもらう
      // 親に渡すための callback は handleSubmit の外で呼びます
    } catch (err) {
      console.error("投稿中にエラーが発生しました", err);
    } finally {
      setPosting(false);
      // do not auto-close popup or the edit form; popup is closed by user action
    }
  };

  // popup is managed by parent; no local cancel

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (error) {
      setError("");
    }
  };

  if (!isRendered) {
    return null;
  }

  const ViewToggle = () => (
    <div className={styles.viewToggle}>
      <button
        onClick={() => setViewMode("write")}
        className={viewMode === "write" ? styles.active : ""}
      >
        Write
      </button>
      <button
        onClick={() => setViewMode("preview")}
        className={viewMode === "preview" ? styles.active : ""}
      >
        Preview
      </button>
    </div>
  );

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div
        className={`${styles.formContainer} ${
          isOpen ? styles.formEnter : styles.formExit
        }`}
      >
        <div className={styles.formHeader}>
          <h2>スニペットを書く</h2>
          <button onClick={onClose} className={styles.closeButton}>
            &times;
          </button>
        </div>
        <form className={styles.formBody} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="snippet-title">タイトル</label>
            <input
              type="text"
              id="snippet-title"
              placeholder="スニペットのタイトル"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div
            className={styles.formGroup}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <label htmlFor="snippet-content">内容</label>

            {isMobile && <ViewToggle />}

            <div className={styles.editorLayout}>
              <textarea
                id="snippet-content"
                placeholder="コードやメモを入力..."
                value={content}
                onChange={handleContentChange}
                className={
                  isMobile && viewMode === "preview" ? styles.hidden : ""
                }
              />
              <div
                className={`${styles.previewArea} ${
                  isMobile && viewMode === "write" ? styles.hidden : ""
                }`}
              >
                <MarkdownText content={content} />
              </div>
            </div>
          </div>

          {error && <p className={styles.errorText}>{error}</p>}
          <button type="submit" className={styles.submitButton}>
            投稿する
          </button>
        </form>
      </div>
      {/* ScoreResultPopup is displayed and managed by parent (ProfileScreen) */}
    </>
  );
};

export default EditForm;
