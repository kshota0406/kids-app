// お手伝いの種類を定義
export type ChoreType = {
  id: string;
  name: string;
  points: number;
  iconName: string;
};

// 完了したお手伝いの記録
export type CompletedChore = {
  id: string;
  choreId: string;
  childId: string; // どの子どものお手伝いか識別するためのID
  completedAt: Date;
  points: number;
  settled: boolean; // 集計済みかどうか
};

// 子どもの情報
export type Child = {
  id: string;
  name: string;
  totalPoints: number;
  color: string; // 子どもごとのテーマカラー
  avatar: string; // アバター画像（シンプルなアイコン名）
}; 