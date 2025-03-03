import React from 'react';
import { useApp } from '@/context/AppContext';

// 絵文字マッピング
const childEmojiMap: {[key: string]: string} = {
  'user': '👤',
  'smile': '😊',
  'heart': '❤️',
  'star': '⭐',
  'sun': '☀️',
  'moon': '🌙',
  'cloud': '☁️',
  'flower': '🌸',
  'tree': '🌳',
  'cat': '🐱',
  'dog': '🐶',
  'rabbit': '🐰',
  'bear': '🐻',
  'panda': '🐼',
  'monkey': '🐵',
  'penguin': '🐧',
  'bird': '🐦',
  'fish': '🐠',
  'turtle': '🐢',
  'butterfly': '🦋',
  'bee': '🐝',
  'ladybug': '🐞',
  'rocket': '🚀',
  // 他のアイコンに対応する絵文字を追加
};

const PointsDisplay: React.FC = () => {
  const { children, selectedChildId, getUnsettledChores, getSettledChores } = useApp();
  
  // 選択された子どもを取得
  const selectedChild = children.find(child => child.id === selectedChildId);
  
  if (!selectedChild) return null;

  // 未集計のお手伝い履歴を取得
  const unsettledChores = getUnsettledChores(selectedChildId);
  
  // 集計済みのお手伝い履歴を取得
  const settledChores = getSettledChores(selectedChildId);
  
  // 未集計ポイントの合計を計算
  const unsettledPoints = unsettledChores.reduce((sum, chore) => sum + chore.points, 0);
  
  // 集計済みポイントの合計を計算
  const settledPoints = settledChores.reduce((sum, chore) => sum + chore.points, 0);

  // アイコン名に対応する絵文字を取得、なければデフォルト絵文字を使用
  const emoji = childEmojiMap[selectedChild.avatar] || '👤';

  return (
    <div 
      className="p-3 rounded-lg shadow-md relative overflow-hidden transition-all hover:shadow-lg"
      style={{ 
        backgroundColor: `${selectedChild.color}10`,
        borderLeft: `4px solid ${selectedChild.color}`
      }}
    >
      <div className="mb-2">
        <h2 className="text-lg font-bold flex items-center">
          <span className="text-xl mr-2">{emoji}</span>
          {selectedChild.name}のポイント
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* 未集計ポイント */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border-l-4 border-blue-400">
          <span className="text-xl">🔵</span>
          <div>
            <div className="text-xs text-blue-600 font-medium">みしゅうけい</div>
            <div>
              <span className="text-xl font-bold">{unsettledPoints}</span>
              <span className="text-xs ml-1">ポイント</span>
            </div>
          </div>
        </div>
        
        {/* 集計済みポイント */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border-l-4 border-green-400">
          <span className="text-xl">🟢</span>
          <div>
            <div className="text-xs text-green-600 font-medium">しゅうけいずみ</div>
            <div>
              <span className="text-xl font-bold">{settledPoints}</span>
              <span className="text-xs ml-1">ポイント</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 合計ポイント */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm mt-2">
        <span className="text-2xl">⭐</span>
        <div>
          <div className="text-xs text-gray-600 font-medium">ごうけい</div>
          <div>
            <span className="text-2xl font-bold">{selectedChild.totalPoints}</span>
            <span className="text-base ml-2">ポイント</span>
          </div>
        </div>
      </div>
      
      {/* 背景装飾 */}
      <div 
        className="absolute -right-8 -bottom-8 opacity-10 text-8xl"
        style={{ color: selectedChild.color }}
      >
        {emoji}
      </div>
    </div>
  );
};

export default PointsDisplay; 