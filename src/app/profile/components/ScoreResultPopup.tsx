"use client";

import React from "react";
import styles from "./ScoreResultPopup.module.css";
import { ScoreSummary } from "@/lib/score/fetchScoreFromAWS";

interface Props {
  open: boolean;
  summary: ScoreSummary;
  onClose: () => void;
  posting?: boolean;
  posted?: boolean;
}

const ScoreResultPopup: React.FC<Props> = ({
  open,
  summary,
  onClose,
  posting,
  posted,
}) => {
  if (!open) return null;

  const keys = Object.keys(summary.individualScores);
  const LABELS: Record<string, string> = {
    learning_depth: "学習の深さ",
    expertise_level: "専門性",
    conciseness: "簡潔さ",
    clarity_logic: "論理性",
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <h3 className={styles.title}>採点結果</h3>
          <button
            className={styles.closeFloating}
            onClick={onClose}
            aria-label="閉じる"
          >
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.scoreLarge}>{summary.finalWeightedScore}</div>
          <div className={styles.subText}>最終スコア</div>
          <div className={styles.rawText}>
            元の値: {Number(summary.finalWeightedScoreRaw).toFixed(2)}
          </div>
          {typeof posting !== "undefined" && (
            <div className={styles.statusText}>
              {posting ? "投稿中..." : posted ? "投稿済み" : null}
            </div>
          )}

          <div className={styles.row}>
            <div className={styles.col}>
              <strong>文字数</strong>
              <div>{summary.characterCount}</div>
            </div>
            <div className={styles.col}>
              <strong>平均品質</strong>
              <div>{summary.averageQualityScore}%</div>
            </div>
          </div>

          {keys.length > 0 && (
            <div className={styles.metrics}>
              {keys.map((k) => (
                <div key={k} className={styles.metricItem}>
                  <div className={styles.metricName}>
                    {LABELS[k] ?? k.replaceAll("_", " ")}
                  </div>
                  <div className={styles.metricValue}>
                    {summary.individualScores[k]}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* ボタンは表示しない。投稿はバックグラウンドで行われる。 */}
      </div>
    </div>
  );
};

export default ScoreResultPopup;
