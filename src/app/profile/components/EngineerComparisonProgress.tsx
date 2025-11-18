export default function EngineerComparisonProgress({ comparison }) {
  // percentageは数値として計算し、toFixed(1)は表示時のみにする
  const rawPercentage = (comparison.myScore / comparison.targetScore) * 100;

  // プログレスバーの長さ。100%を超えないように調整
  const progressBarWidth = Math.min(100, rawPercentage).toFixed(1);

  // 遅れ（ディレイ）。100%以下の場合のみ計算
  const delayPercentage = Math.max(0, 100 - rawPercentage).toFixed(1);

  return (
    <>
      <div>
        <div>
          <div>{comparison.title}</div>
          <div>{rawPercentage.toFixed(1)}%</div>
          <div>My Score: {comparison.myScore} pt</div>
        </div>
        <div>
          <div>遅れ：{delayPercentage}%</div>
          <div>目標スコア</div>
          <div>{comparison.targetScore} pt</div>
        </div>
      </div>
    </>
  );
}
