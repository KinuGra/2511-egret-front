import { PlanetaryComparison } from '@/app/profile/components/ComparePlanet'; // パスを調整してください

export default function Home() {
  // 表示したいスコアを定義 [地球, 土星, 太陽]
  // 例1: 太陽が圧倒的に大きい
  const scores1: [number, number, number] = [1000, 50000, 100000];

  // 例2: 地球と土星が同じくらい
  const scores2: [number, number, number] = [30000, 30000, 80000];

  return (
    <main style={{ padding: '20px' }}>
      <h1>惑星サイズの比較 (R3F)</h1>

      <p>スコア: 地球={scores1[0]}, 土星={scores1[1]}, 太陽={scores1[2]}</p>
      <PlanetaryComparison score={scores1} />

      <hr style={{ margin: '40px 0' }} />

      <p>スコア: 地球={scores2[0]}, 土星={scores2[1]}, 太陽={scores2[2]}</p>
      <PlanetaryComparison score={scores2} />
    </main>
  );
}