'use client';

import React, { useState } from 'react';
import { AppProvider } from '@/context/AppContext';
import ChoreCard from '@/components/ChoreCard';
import PointsDisplay from '@/components/PointsDisplay';
import HistoryList from '@/components/HistoryList';
import ChildSelector from '@/components/ChildSelector';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';

// お手伝いリストを表示するコンポーネント
const ChoresList = () => {
  const { chores } = useApp();

  return (
    <div className="card mt-6 shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <span className="text-2xl mr-2" style={{ color: "#ff922b" }}>⭐</span>
        おてつだいメニュー
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {chores.map((chore) => (
          <ChoreCard key={chore.id} chore={chore} />
        ))}
      </div>
    </div>
  );
};

// アプリのメインコンテンツ
const AppContent = () => {
  const { children, settlePoints } = useApp();
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [settledResults, setSettledResults] = useState<{[key: string]: number}>({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // 全ての子どもの集計処理
  const handleSettleAll = () => {
    const results: {[key: string]: number} = {};
    
    // 全ての子どもの未集計ポイントを集計
    children.forEach(child => {
      results[child.id] = settlePoints(child.id);
    });
    
    setSettledResults(results);
    setShowSettleModal(true);
  };

  // パスワード確認処理
  const handlePasswordCheck = () => {
    if (password === '1234') {
      setShowPasswordModal(false);
      handleSettleAll();
      setPassword('');
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  // 集計ボタンクリック時の処理
  const handleSettleClick = () => {
    setShowPasswordModal(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-2 py-6">
      <header className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center">
          <span className="text-3xl mr-2" style={{ color: "#ff922b" }}>🏆</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">おてつだいポイント</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSettleClick}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <span className="text-xl">📅</span>
            <span className="hidden sm:inline">しゅうけい</span>
          </button>
          <Link 
            href="/settings" 
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <span className="text-xl">⚙️</span>
            <span className="hidden sm:inline">せってい</span>
          </Link>
        </div>
      </header>

      {/* パスワード入力モーダル */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-2xl mr-2">🔒</span>
              パスワードにゅうりょく
            </h2>
            
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePasswordCheck()}
                className={`w-full p-3 border rounded-lg text-center text-2xl ${passwordError ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="＊＊＊＊"
                autoFocus
              />
              {passwordError && (
                <p className="text-red-500 text-center mt-2">パスワードがちがいます</p>
              )}
            </div>
            
            <div className="flex justify-between gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword('');
                  setPasswordError(false);
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg"
              >
                キャンセル
              </button>
              <button
                onClick={handlePasswordCheck}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                かくにん
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 集計モーダル */}
      {showSettleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-2xl mr-2">💰</span>
              おこづかいけいさん
            </h2>
            
            {Object.keys(settledResults).length > 0 ? (
              <div>
                {children.map(child => {
                  // 子どもアイコンの絵文字マッピング
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
                    'award': '🏆',
                    'gift': '🎁',
                  };
                  
                  // アイコン名に対応する絵文字を取得、なければデフォルト絵文字を使用
                  const emoji = childEmojiMap[child.avatar] || '👤';
                  
                  return (
                    <div key={child.id} className="mb-4 p-4 rounded-lg" style={{ backgroundColor: `${child.color}10` }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl" style={{ color: child.color }}>{emoji}</span>
                        <h3 className="font-bold">{child.name}</h3>
                      </div>
                      
                      {settledResults[child.id] > 0 ? (
                        <div>
                          <div className="flex items-center justify-center gap-2 text-2xl font-bold">
                            <span className="text-2xl">⭐</span>
                            <span>{settledResults[child.id]}</span>
                            <span className="text-base">ポイント</span>
                          </div>
                          <div className="flex items-center justify-center gap-2 text-2xl font-bold mt-2">
                            <span className="text-2xl">💴</span>
                            <span>{settledResults[child.id]}</span>
                            <span className="text-base">えん</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-center text-gray-500">しゅうけいするおてつだいがありません</p>
                      )}
                    </div>
                  );
                })}
                <p className="mt-4 text-sm text-gray-600 text-center">おてつだいをしゅうけいしました！</p>
              </div>
            ) : (
              <p className="text-center py-4">しゅうけいするおてつだいがありません</p>
            )}
            
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowSettleModal(false)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                とじる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 子ども選択とポイント表示を横に並べる */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <ChildSelector />
            <PointsDisplay />
          </div>
          <ChoresList />
        </div>
        <div>
          <HistoryList />
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
