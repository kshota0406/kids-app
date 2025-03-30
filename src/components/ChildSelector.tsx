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
  // 追加アイコン
  'lion': '🦁',
  'tiger': '🐯',
  'elephant': '🐘',
  'giraffe': '🦒',
  'zebra': '🦓',
  'unicorn': '🦄',
  'dragon': '🐉',
  'dolphin': '🐬',
  'whale': '🐳',
  'octopus': '🐙',
  'shark': '🦈',
  'frog': '🐸',
  'fox': '🦊',
  'wolf': '🐺',
  'koala': '🐨',
  'hedgehog': '🦔',
  'owl': '🦉',
  'chicken': '🐔',
  'duck': '🦆',
  'swan': '🦢',
  'eagle': '🦅',
  'peacock': '🦚',
  'parrot': '🦜',
  'flamingo': '🦩',
  'snail': '🐌',
  'ant': '🐜',
  'spider': '🕷️',
  'icecream': '🍦',
  'taco': '🌮',
  'grapes': '🍇',
  'peach': '🍑',
  'mango': '🥭',
  'balloon': '🎈',
  'crown': '👑',
  'robot': '🤖',
  'alien': '👽',
  'ghost': '👻',
  'ninja': '🥷',
  'superhero': '🦸',
  'fairy': '🧚',
  'mermaid': '🧜',
  'wizard': '🧙',
  'rainbow': '🌈',
  'meteor': '☄️',
  'lightning': '⚡',
  'fire': '🔥',
  'snowflake': '❄️',
  'beach': '🏖️',
  'mountain': '🏔️',
  'football': '⚽',
  'basketball': '🏀',
  'baseball': '⚾',
  'tennis': '🎾',
  'gaming': '🎮',
  'medal': '🏅',
  'trophy': '🏆',
  'airplane': '✈️',
  'ship': '🚢',
  'guitar': '🎸',
  'piano': '🎹',
  'trumpet': '🎺',
  'drum': '🥁',
  'microphone': '🎤',
  'magicwand': '🪄',
  'book': '📚',
  'pencil': '✏️',
  'palette': '🎨',
  'camera': '📷',
  'lightbulb': '💡',
  'hat': '🎩',
  'crystal': '🔮',
  'lock': '🔒',
  'key': '🔑',
  'compass': '🧭',
  'clock': '⏰',
  'heart_purple': '💜',
  'heart_blue': '💙',
  'heart_green': '💚',
  'heart_yellow': '💛',
  'heart_pink': '💖',
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
                className={`flex items-center px-4 py-2.5 rounded-lg cursor-pointer transition-all ${
                  selectedChildId === child.id
                    ? 'bg-white shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                style={{
                  borderLeft: selectedChildId === child.id ? `4px solid ${child.color}` : 'none',
                }}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{emoji}</span>
                  <span className="font-bold text-lg">{child.name}</span>
                  <div className="flex items-center ml-2 bg-yellow-50 px-2 py-1 rounded-full">
                    <span className="text-sm">⭐</span>
                    <span className="ml-1 text-sm font-bold">{child.totalPoints}</span>
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