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
  'car': '🚗',
  'train': '🚂',
  'bicycle': '🚲',
  'ball': '⚽',
  'gift': '🎁',
  'cake': '🍰',
  'ice-cream': '🍦',
  'candy': '🍬',
  'apple': '🍎',
  'banana': '🍌',
  'cherry': '🍒',
  'strawberry': '🍓',
  'watermelon': '🍉',
  'pizza': '🍕',
  'hamburger': '🍔',
  'fries': '🍟',
  'sushi': '🍣',
  'cookie': '🍪',
  'chocolate': '🍫',
  'lollipop': '🍭',
  'donut': '🍩',
  'cupcake': '🧁',
  // 他のアイコンに対応する絵文字を追加
};

const ChildSelector: React.FC = () => {
  const { children, selectedChildId, setSelectedChildId } = useApp();

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex gap-2 overflow-x-auto">
          {children.map((child) => {
            // アイコン名に対応する絵文字を取得、なければデフォルト絵文字を使用
            const emoji = childEmojiMap[child.avatar] || '👤';
            
            return (
              <div
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`flex items-center px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  selectedChildId === child.id
                    ? 'bg-white shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                style={{
                  borderLeft: selectedChildId === child.id ? `3px solid ${child.color}` : 'none',
                }}
              >
                <div className="flex items-center">
                  <span className="text-xl mr-2">{emoji}</span>
                  <span className="font-bold">{child.name}</span>
                  <div className="flex items-center ml-2 bg-yellow-50 px-2 py-0.5 rounded-full">
                    <span className="text-xs">⭐</span>
                    <span className="ml-1 text-xs font-bold">{child.totalPoints}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChildSelector; 