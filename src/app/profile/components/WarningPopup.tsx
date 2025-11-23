"use client";

import React from "react";
import styles from "./WarningPopup.module.css";

interface Props {
  open: boolean;
  score: number;
  percent1: number;
  percent2: number;
  onClose: () => void;
}

const WarningPopup: React.FC<Props> = ({
  open,
  score,
  percent1,
  percent2,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        {/* 警告アイコン */}
        <div className={styles.iconWrapper}>
          <div className={styles.warningIcon}>
            <span className={styles.exclamation}>!</span>
          </div>
        </div>

        {/* タイトル */}
        <h2 className={styles.title}>緊急警告</h2>

        {/* メッセージ本文 */}
        <div className={styles.content}>
          <p className={styles.mainMessage}>
            <strong>同世代の</strong>
            <span className={styles.highlight}>活躍するエンジニア</span>
            <strong>に比べ、</strong>
            <span className={styles.percentHighlight}>{percent1}%</span>
            <strong>の学習遅延、</strong>
            <span className={styles.scoreHighlight}>{score} 点</span>
            <strong>のビハインドがあります。</strong>
          </p>

          <p className={styles.subMessage}>
            さらに、
            <span className={styles.highlight2}>周囲の平均エンジニア</span>
            と比べても{" "}
            <span className={styles.percentHighlight2}>{percent2}%</span> の
            遅れが存在します。この差は、キャリア形成に深刻な影響を与える可能性があります。
            今すぐ学びを投稿し、遅れを取り戻しましょう！
          </p>
        </div>

        {/* アクションボタン */}
        <button className={styles.actionButton} onClick={onClose}>
          OK、今すぐ行動する
        </button>
      </div>
    </div>
  );
};

export default WarningPopup;
