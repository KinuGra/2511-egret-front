import styles from "./EngineerComparisonProgress.module.css";
export default function EngineerComparisonProgress({ comparison }) {
  // percentageは数値として計算し、toFixed(1)は表示時のみにする
  const rawPercentage = (comparison.myScore / comparison.targetScore) * 100;

  // プログレスバーの長さ。100%を超えないように調整
  const progressBarWidth = Math.min(100, rawPercentage).toFixed(1);

  // 遅れ（ディレイ）。100%以下の場合のみ計算
  const delayPercentage = Math.max(0, 100 - rawPercentage).toFixed(1);

  // 色に応じたクラスを動的に決定
  const colorClass =
    comparison.colorCode === "red" ? styles.colorRed : styles.colorOrange;

  return (
    <>
      <div className={styles.card}>
        <div className={styles.barContaier}>
          {/* プログレスバーの背景と進捗 */}
          <div className={styles.progressBarBackground}>
            <div
              className={`${styles.progressBar} ${colorClass}`}
              style={{ width: `${progressBarWidth}%` }}
            ></div>
          </div>

          {/* テキストオーバーレイ */}
          <div className={styles.textOverlay}>
            <div className={styles.leftInfo}>
              <div className={styles.title}>{comparison.title}</div>
              <div className={`${styles.percentage} ${colorClass}`}>
                {progressBarWidth}%
              </div>
              <div className={styles.myScore}>
                My Score:{" "}
                <span className="font-bold">{comparison.myScore}</span> pt
              </div>
            </div>
            <div className={styles.rightInfo}>
              <div className={`${styles.delayBadge} ${styles.colorClass}`}>
                遅れ：{delayPercentage}%
              </div>
              <div className={styles.targetLabel}>目標スコア</div>
              <div className={styles.targetScore}>
                <span className="font-bold">{comparison.targetScore}</span> pt
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
