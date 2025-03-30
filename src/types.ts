export interface Child {
  id: string;
  name: string;
  totalPoints: number;
  color: string;
  avatar: string;
}

export interface Chore {
  id: string;
  name: string;
  points: number;
  iconName: string;
}

export interface CompletedChore {
  id: string;
  childId: string;
  choreId: string;
  choreName: string;  // 完了時のお手伝い名
  points: number;     // 完了時のポイント
  timestamp: string;  // 完了日時（ISO文字列）
  isSettled: boolean; // 集計済みかどうか
} 