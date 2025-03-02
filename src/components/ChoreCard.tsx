import React, { useState } from 'react';
import { ChoreType } from '@/types';
import { useApp } from '@/context/AppContext';

// 絵文字マッピング
const emojiMap: {[key: string]: string} = {
  'trash': '🗑️',
  'book': '📚',
  'broom': '🧹',
  'dish': '🍽️',
  'laundry': '👕',
  'plant': '🌱',
  'bed': '🛏️',
  'pet': '🐶',
  'toy': '🧸',
  'clean': '🧼',
  'mail': '📬',
  'shop': '🛒',
  'star': '⭐',
  'check': '✅',
  // 他のアイコンに対応する絵文字を追加
};

type ChoreCardProps = {
  chore: ChoreType;
};

const ChoreCard: React.FC<ChoreCardProps> = ({ chore }) => {
  const { addCompletedChore, selectedChildId, children } = useApp();
  const [isAnimating, setIsAnimating] = useState(false);
  
  // 選択された子どもを取得
  const selectedChild = children.find(child => child.id === selectedChildId);
  
  if (!selectedChild) return null;

  const handleComplete = () => {
    // アニメーション開始
    setIsAnimating(true);
    
    // お手伝い完了を記録
    addCompletedChore(chore.id, selectedChildId);
    
    // アニメーション終了
    setTimeout(() => {
      setIsAnimating(false);
    }, 700);
  };

  // アイコン名に対応する絵文字を取得、なければデフォルト絵文字を使用
  const emoji = emojiMap[chore.iconName] || '✨';

  return (
    <div 
      className={`flex flex-col items-center p-3 cursor-pointer transition-all shadow-sm hover:shadow-md rounded-lg ${
        isAnimating ? 'animate-bounce' : ''
      }`} 
      onClick={handleComplete}
      style={{ 
        borderTop: `3px solid ${selectedChild.color}`,
        backgroundColor: 'white',
        maxWidth: '120px',
      }}
    >
      <div 
        className="mb-2 text-2xl"
      >
        {emoji}
      </div>
      <h3 className="text-sm font-bold mb-1 text-center">{chore.name}</h3>
      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full text-xs">
        <span>⭐</span>
        <span className="font-bold text-gray-700">{chore.points}</span>
      </div>
      
    </div>
  );
};

export default ChoreCard; 