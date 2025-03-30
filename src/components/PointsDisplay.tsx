'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Image from 'next/image';

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
  // 追加のアイコン
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
  'candy': '🍬',
  'icecream': '🍦',
  'cake': '🍰',
  'pizza': '🍕',
  'hamburger': '🍔',
  'taco': '🌮',
  'sushi': '🍣',
  'apple': '🍎',
  'banana': '🍌',
  'grapes': '🍇',
  'strawberry': '🍓',
  'watermelon': '🍉',
  'cherry': '🍒',
  'peach': '🍑',
  'mango': '🥭',
  'balloon': '🎈',
  'gift': '🎁',
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
  'car': '🚗',
  'train': '🚂',
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

// レベルに対応した称号
const levelTitles = [
  'ビギナー', // レベル1
  'ルーキー', // レベル2
  'チャレンジャー', // レベル3
  'エキスパート', // レベル4
  'マスター', // レベル5
  'チャンピオン', // レベル6
  'レジェンド', // レベル7以上
];

// レベルごとの背景グラデーション
const levelGradients = [
  'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', // レベル1
  'linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)', // レベル2
  'linear-gradient(135deg, #ffe066 0%, #ffd43b 100%)', // レベル3
  'linear-gradient(135deg, #74c0fc 0%, #339af0 100%)', // レベル4
  'linear-gradient(135deg, #63e6be 0%, #20c997 100%)', // レベル5
  'linear-gradient(135deg, #b197fc 0%, #7950f2 100%)', // レベル6
  'linear-gradient(135deg, #ff8787 0%, #ff6b6b 100%)', // レベル7以上
];

const PointsDisplay: React.FC = () => {
  const { children, getUnsettledChores, getSettledChores } = useApp();
  const [activeCard, setActiveCard] = useState<string | null>(null);
  
  return (
    <div className="card shadow-sm hover:shadow-md transition-shadow border border-purple-100 h-full rounded-xl">
      <div className="p-2 flex flex-col h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
          {children.map((child, index) => {
            // 未集計のお手伝い履歴を取得
            const unsettledChores = getUnsettledChores(child.id);
            
            // 集計済みのお手伝い履歴を取得
            const settledChores = getSettledChores(child.id);
            
            // 未集計ポイントの合計を計算
            const unsettledPoints = unsettledChores.reduce((sum, chore) => sum + chore.points, 0);
            
            // 集計済みポイントの合計を計算
            const settledPoints = settledChores.reduce((sum, chore) => sum + chore.points, 0);

            // アイコン名に対応する絵文字を取得、なければデフォルト絵文字を使用
            const emoji = childEmojiMap[child.avatar] || '👤';

            // カラフルな背景パターンをランダムに選択
            const patterns = [
              'radial-gradient(circle at 10% 20%, rgba(255, 200, 58, 0.1) 0%, rgba(255, 94, 125, 0.1) 90%)',
              'linear-gradient(135deg, rgba(126, 87, 255, 0.1) 0%, rgba(76, 217, 100, 0.1) 100%)',
              'linear-gradient(45deg, rgba(255, 94, 125, 0.1) 0%, rgba(255, 200, 58, 0.1) 100%)',
              'linear-gradient(to right, rgba(76, 217, 100, 0.1) 0%, rgba(126, 87, 255, 0.1) 100%)'
            ];
            const bgPattern = patterns[index % patterns.length];

            // レベルの計算（100ポイントごとにレベルアップ）
            const level = Math.floor(child.totalPoints / 100) + 1;
            const levelProgress = (child.totalPoints % 100) / 100 * 100;
            
            // 称号を取得
            const title = level <= 7 ? levelTitles[level - 1] : levelTitles[6];
            
            // レベルに応じた背景グラデーション
            const levelGradient = level <= 7 ? levelGradients[level - 1] : levelGradients[6];

            const isActive = activeCard === child.id;

            return (
              <div 
                key={child.id}
                className={`p-3 rounded-xl shadow-sm relative overflow-hidden transition-all kid-frame ${
                  isActive ? 'scale-105 shadow-lg' : 'hover:shadow-md'
                }`}
                style={{ 
                  backgroundImage: bgPattern,
                  borderImageSource: `linear-gradient(45deg, ${child.color}, #ffffff)`,
                  transition: 'all 0.3s ease',
                }}
                onClick={() => setActiveCard(isActive ? null : child.id)}
              >
                <div className="flex items-center mb-2">
                  <div 
                    className={`text-2xl mr-2 ${isActive ? 'bounce-custom' : 'float'}`}
                    style={{ color: child.color }}
                  >
                    {emoji}
                  </div>
                  <div>
                    <h2 className="text-base font-bold flex items-center">
                      <span style={{ color: child.color }}>{child.name}</span>
                    </h2>
                    <div className="flex items-center">
                      <span className="text-xs" style={{ color: child.color }}>
                        Lv.{level} {title}
                      </span>
                    </div>
                  </div>
                  
                  {/* レベルバッジ */}
                  <div 
                    className="ml-auto w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm sparkle"
                    style={{ background: levelGradient }}
                  >
                    {level}
                  </div>
                </div>
                
                {/* レベルプログレスバー */}
                <div className="bg-gray-200 h-2 rounded-full mb-3 overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${levelProgress}%`,
                      background: `linear-gradient(90deg, ${child.color}70, ${child.color})`,
                      transition: 'width 1s ease-in-out'
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {/* 未集計ポイント */}
                  <div 
                    className={`flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border-l-2 border-blue-400 ${
                      unsettledPoints > 0 ? 'pulse-custom' : ''
                    }`}
                  >
                    <span className="text-xl float">🔵</span>
                    <div>
                      <div className="text-xs text-blue-600 font-medium">みしゅうけい</div>
                      <div className="flex items-center">
                        <span className="text-lg font-bold">{unsettledPoints}</span>
                        <span className="text-xs ml-1">ポイント</span>
                        {unsettledPoints > 0 && (
                          <span className="ml-1 text-xs bg-blue-100 text-blue-600 px-1 py-0.5 rounded-full blink">
                            ためてる
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* 集計済みポイント */}
                  <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border-l-2 border-green-400">
                    <span className="text-xl float">🟢</span>
                    <div>
                      <div className="text-xs text-green-600 font-medium">しゅうけいずみ</div>
                      <div className="flex items-center">
                        <span className="text-lg font-bold">{settledPoints}</span>
                        <span className="text-xs ml-1">ポイント</span>
                        {settledPoints > 0 && (
                          <span className="ml-1 text-xs bg-green-100 text-green-600 px-1 py-0.5 rounded-full">
                            ゲット
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 合計ポイント */}
                <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm mt-2">
                  <div 
                    className="flex items-center justify-center p-1.5 rounded-full text-xl float"
                    style={{ backgroundColor: `${child.color}30` }}
                  >
                    ⭐
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 font-medium">ごうけい</div>
                    <div className="flex items-center">
                      <span className="text-xl font-bold rainbow-text">{child.totalPoints}</span>
                      <span className="text-sm ml-1">ポイント</span>
                    </div>
                  </div>
                </div>
                
                {/* 背景装飾 */}
                <div 
                  className="absolute -right-8 -bottom-8 opacity-10 text-7xl"
                  style={{ color: child.color }}
                >
                  {emoji}
                </div>
                
                {/* 達成マーク */}
                {child.totalPoints > 500 && (
                  <div className="absolute top-2 right-2 text-xl bounce-custom" style={{ display: 'inline-block' }}>
                    🏆
                  </div>
                )}

                {/* 特別なバッジ */}
                {unsettledChores.length > 10 && (
                  <div className="absolute top-2 left-2 text-base" style={{ display: 'inline-block' }}>
                    🎖️
                  </div>
                )}

                {/* 応援メッセージ（アクティブ時のみ表示） */}
                {isActive && (
                  <div className="mt-2 text-center">
                    <p className="text-xs text-gray-600">
                      {level < 3 ? 
                        'もっとがんばろう！' : 
                        level < 5 ? 
                          'すごい！がんばってるね！' : 
                          'すごい！チャンピオンめざして！'}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PointsDisplay; 