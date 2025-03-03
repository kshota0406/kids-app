'use client';

import React, { useState } from 'react';
import { AppProvider } from '@/context/AppContext';
import ChoreCard from '@/components/ChoreCard';
import PointsDisplay from '@/components/PointsDisplay';
import HistoryList from '@/components/HistoryList';
import ChildSelector from '@/components/ChildSelector';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { CompletedChore } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// お手伝いリストを表示するコンポーネント
const ChoresList = () => {
  const { chores } = useApp();

  return (
    <div className="card shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-bold mb-3 flex items-center">
        <span className="text-2xl mr-2" style={{ color: "#ff922b" }}>⭐</span>
        おてつだいメニュー
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {chores.map((chore) => (
          <ChoreCard key={chore.id} chore={chore} />
        ))}
      </div>
    </div>
  );
};

// アプリのメインコンテンツ
const AppContent = () => {
  const { children, settlePoints, chores, getChildCompletedChores } = useApp();
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [settledResults, setSettledResults] = useState<{[key: string]: number}>({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [pendingAction, setPendingAction] = useState<'settle' | 'settings' | null>(null);

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
      setPassword('');
      setPasswordError(false);
      
      // パスワード確認後の処理
      if (pendingAction === 'settle') {
        handleSettleAll();
      } else if (pendingAction === 'settings') {
        window.location.href = '/settings';
      }
      
      setPendingAction(null);
    } else {
      setPasswordError(true);
    }
  };

  // 集計ボタンクリック時の処理
  const handleSettleClick = () => {
    setPendingAction('settle');
    setShowPasswordModal(true);
  };

  // 設定ページへのリンククリック時の処理
  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setPendingAction('settings');
    setShowPasswordModal(true);
  };

  // お手伝いの統計データを計算（子ども別）
  const getChildStats = () => {
    const stats: {[key: string]: number} = {};
    
    children.forEach(child => {
      const completedChores = getChildCompletedChores(child.id);
      stats[child.name] = completedChores.length;
    });
    
    return stats;
  };

  // お手伝いの統計データを計算（カテゴリ別）
  const getCategoryStats = () => {
    const stats: {[key: string]: number} = {};
    const childStats: {[key: string]: {[key: string]: number}} = {};
    
    children.forEach(child => {
      const completedChores = getChildCompletedChores(child.id);
      childStats[child.name] = {};
      
      completedChores.forEach((chore: CompletedChore) => {
        const choreName = chores.find(c => c.id === chore.choreId)?.name || '不明';
        stats[choreName] = (stats[choreName] || 0) + 1;
        childStats[child.name][choreName] = (childStats[child.name][choreName] || 0) + 1;
      });
    });
    
    return { total: stats, byChild: childStats };
  };

  // 子ども別のグラフデータ
  const childChartData = {
    labels: Object.keys(getChildStats()),
    datasets: [
      {
        label: 'おてつだいかいすう',
        data: Object.values(getChildStats()),
        backgroundColor: children.map(child => `${child.color}CC`),
        borderColor: children.map(child => child.color),
        borderWidth: 2,
        borderRadius: 8,
        maxBarThickness: 50,
      },
    ],
  };

  // カテゴリ別のグラフデータ
  const categoryChartData = {
    labels: Object.keys(getCategoryStats().total),
    datasets: [
      {
        label: 'おてつだいかいすう',
        data: Object.values(getCategoryStats().total),
        backgroundColor: '#ff922bCC',
        borderColor: '#ff922b',
        borderWidth: 2,
        borderRadius: 8,
        maxBarThickness: 50,
      },
    ],
  };

  // グラフのオプション
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1a1a1a',
        bodyColor: '#1a1a1a',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context: any) {
            return `${context.raw}かい`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 12,
          },
          color: '#666',
        },
        grid: {
          display: false,
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
          color: '#666',
        },
        grid: {
          display: false,
        },
      },
    },
    animation: {
      duration: 1000,
    },
  } as const;

  return (
    <div className="max-w-[1400px] mx-auto px-1 py-4">
      <header className="flex items-center justify-between mb-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center">
          <span className="text-3xl mr-2" style={{ color: "#ff922b" }}>🏆</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">おてつだいポイント</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <span className="text-xl">📊</span>
            <span className="hidden sm:inline">とうけい</span>
          </button>
          <button
            onClick={handleSettleClick}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <span className="text-xl">📅</span>
            <span className="hidden sm:inline">しゅうけい</span>
          </button>
          <button
            onClick={handleSettingsClick}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <span className="text-xl">⚙️</span>
            <span className="hidden sm:inline">せってい</span>
          </button>
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
                  setPendingAction(null);
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

      {/* 統計グラフモーダル */}
      {showStats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-5xl w-full shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold flex items-center">
                <span className="text-3xl mr-2">📊</span>
                おてつだいとうけい
              </h2>
              <button
                onClick={() => setShowStats(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <span className="text-2xl">✕</span>
              </button>
            </div>
            
            <div className="max-h-[80vh] overflow-y-auto space-y-12">
              {/* 子ども別のグラフ */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold mb-6 text-blue-600">こどもべつおてつだいかいすう</h3>
                <div className="h-[300px]">
                  <Bar data={childChartData} options={chartOptions} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                  {Object.entries(getChildStats()).map(([childName, count]) => {
                    const child = children.find(c => c.name === childName);
                    if (!child) return null;
                    return (
                      <div key={childName} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="font-bold text-lg mb-2" style={{ color: child.color }}>{childName}</div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">ごうけい</span>
                          <span className="text-xl font-bold" style={{ color: child.color }}>{count}かい</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* カテゴリ別のグラフ */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold mb-6 text-orange-500">おてつだいしゅるいべつかいすう</h3>
                <div className="h-[300px]">
                  <Bar data={categoryChartData} options={chartOptions} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                  {children.map(child => (
                    <div key={child.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="font-bold text-lg mb-2" style={{ color: child.color }}>{child.name}</div>
                      <div className="space-y-2">
                        {Object.entries(getCategoryStats().byChild[child.name] || {}).map(([choreName, count]) => (
                          <div key={choreName} className="flex justify-between items-center">
                            <span className="text-gray-600">{choreName}</span>
                            <span className="font-bold" style={{ color: child.color }}>{count}かい</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 子ども選択とポイント表示を横に並べる */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <div className="mb-4">
            <ChildSelector />
            <PointsDisplay />
          </div>
          <ChoresList />
        </div>
        <div className="h-[calc(100vh-180px)] overflow-y-auto">
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
