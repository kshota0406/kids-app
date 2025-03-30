'use client';

import React, { useState } from 'react';
import { AppProvider } from '@/context/AppContext';
import PointsDisplay from '@/components/PointsDisplay';
import HistoryList from '@/components/HistoryList';
import ChildSelector from '@/components/ChildSelector';
import ChoresList from '@/components/ChoresList';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { CompletedChore } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// アプリのメインコンテンツ
const AppContent = () => {
  const { 
    children, 
    chores, 
    getChildCompletedChores, 
    settlePoints,
    getSharedHistory,
    getUnsettledChores
  } = useApp();
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
    
    console.log('=== 全子供集計処理開始 ===');
    
    // 集計前の全子供の未集計状況を確認
    console.log('--- 集計前の状況確認 ---');
    children.forEach(child => {
      const unsettledChores = getUnsettledChores(child.id);
      console.log(`${child.name} (ID: ${child.id}): 未集計${unsettledChores.length}件`);
      if (unsettledChores.length > 0) {
        console.log('未集計内容:', unsettledChores);
      }
    });

    console.log('--- 各子供の集計処理実行 ---');
    // 各子供ごとに処理
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      console.log(`${i + 1}人目: ${child.name} (ID: ${child.id}) の集計開始`);
      
      // この子供の未集計ポイントを集計
      const settledPoint = settlePoints(child.id);
      console.log(`${child.name} の集計結果: ${settledPoint}ポイント`);
      
      // 結果を保存
      results[child.id] = settledPoint;
      
      // 集計直後の状態を確認
      const remainingUnsettled = getUnsettledChores(child.id);
      console.log(`${child.name}の残りの未集計: ${remainingUnsettled.length}件`);
    }
    
    // 集計後の全子供の状況を再確認
    console.log('--- 集計後の最終確認 ---');
    children.forEach(child => {
      const unsettledChores = getUnsettledChores(child.id);
      console.log(`${child.name} (ID: ${child.id}): 未集計${unsettledChores.length}件`);
      if (unsettledChores.length > 0) {
        console.error('エラー: まだ未集計が残っています', unsettledChores);
      }
    });
    
    console.log('=== 全子供集計処理完了 ===');
    console.log('最終結果:', results);
    
    // モーダルに表示する結果をセット
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

  // ポイント合計のデータを計算（子ども別）
  const getPointStats = () => {
    const stats: {[key: string]: number} = {};
    
    children.forEach(child => {
      const completedChores = getChildCompletedChores(child.id);
      const points = completedChores.reduce((sum, chore) => sum + chore.points, 0);
      stats[child.name] = points;
    });
    
    return stats;
  };

  // 曜日別のお手伝い回数を計算
  const getWeekdayStats = () => {
    const weekdays = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
    const stats: {[key: string]: number} = {};
    
    // 初期化
    weekdays.forEach(day => {
      stats[day] = 0;
    });
    
    // 全てのお手伝い履歴から曜日別に集計
    getSharedHistory().forEach((chore: CompletedChore) => {
      const date = new Date(chore.timestamp);
      const weekday = weekdays[date.getDay()];
      stats[weekday] = (stats[weekday] || 0) + 1;
    });
    
    return stats;
  };

  // 時間帯別のお手伝い回数を計算
  const getTimeStats = () => {
    const timeRanges = ['朝(6-9時)', '午前(9-12時)', '午後(12-15時)', '夕方(15-18時)', '夜(18-21時)', '深夜(21-6時)'];
    const stats: {[key: string]: number} = {};
    
    // 初期化
    timeRanges.forEach(time => {
      stats[time] = 0;
    });
    
    // 全てのお手伝い履歴から時間帯別に集計
    getSharedHistory().forEach((chore: CompletedChore) => {
      const date = new Date(chore.timestamp);
      const hour = date.getHours();
      
      let timeRange = '';
      if (hour >= 6 && hour < 9) {
        timeRange = '朝(6-9時)';
      } else if (hour >= 9 && hour < 12) {
        timeRange = '午前(9-12時)';
      } else if (hour >= 12 && hour < 15) {
        timeRange = '午後(12-15時)';
      } else if (hour >= 15 && hour < 18) {
        timeRange = '夕方(15-18時)';
      } else if (hour >= 18 && hour < 21) {
        timeRange = '夜(18-21時)';
      } else {
        timeRange = '深夜(21-6時)';
      }
      
      stats[timeRange] = (stats[timeRange] || 0) + 1;
    });
    
    return stats;
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

  // ポイント合計のグラフデータ
  const pointChartData = {
    labels: Object.keys(getPointStats()),
    datasets: [
      {
        label: 'ポイントごうけい',
        data: Object.values(getPointStats()),
        backgroundColor: children.map(child => `${child.color}CC`),
        borderColor: children.map(child => child.color),
        borderWidth: 2,
        borderRadius: 8,
        maxBarThickness: 50,
      },
    ],
  };

  // 曜日別のグラフデータ
  const weekdayChartData = {
    labels: Object.keys(getWeekdayStats()),
    datasets: [
      {
        label: '曜日別おてつだいかいすう',
        data: Object.values(getWeekdayStats()),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(199, 199, 199, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // 時間帯別のグラフデータ
  const timeChartData = {
    labels: Object.keys(getTimeStats()),
    datasets: [
      {
        label: '時間帯別おてつだいかいすう',
        data: Object.values(getTimeStats()),
        backgroundColor: [
          'rgba(255, 159, 64, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 99, 132, 0.7)',
        ],
        borderColor: [
          'rgba(255, 159, 64, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      }
    ]
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

  // ポイント表示用のオプション
  const pointChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        ...chartOptions.plugins.tooltip,
        callbacks: {
          label: function(context: any) {
            return `${context.raw}ポイント`;
          }
        }
      }
    }
  };

  // 円グラフのオプション
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: {
            size: 12,
          }
        }
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
            return `${context.label}: ${context.raw}かい`;
          }
        }
      }
    },
    animation: {
      duration: 1000,
    },
  } as const;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-purple-800">お手伝いアプリ</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleSettleClick}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
          >
            <span className="mr-1">💰</span> ポイント集計
          </button>
          <a 
            href="/settings" 
            onClick={handleSettingsClick}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center"
          >
            <span className="mr-1">⚙️</span> 設定
          </a>
        </div>
      </header>

      <ChoresList />
      
      <div className="mb-6">
        <PointsDisplay />
      </div>
      
      <div className="mb-6">
        <HistoryList />
      </div>
      
      {/* 統計情報を表示 */}
      <button
        onClick={() => setShowStats(!showStats)}
        className="mb-4 bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center"
      >
        <span className="mr-1">📊</span> 
        {showStats ? '統計を閉じる' : '統計を表示'}
      </button>

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
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center">
              <span className="text-3xl mr-2">💰</span>
              おてつだいしゅうけい
            </h2>
              
            <div className="p-4 space-y-4">
              {children.map(child => {
                // 子どもアイコンの絵文字マッピング
                const childEmojiMap: {[key: string]: string} = {
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
                
                // アイコン名に対応する絵文字を取得、なければデフォルト絵文字を使用
                const emoji = childEmojiMap[child.avatar] || '👤';
                
                return (
                  <div key={child.id} className="mb-4 p-4 rounded-lg" style={{ backgroundColor: `${child.color}10` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl" style={{ color: child.color }}>{emoji}</span>
                      <h3 className="font-bold">{child.name}</h3>
                    </div>
                    
                    {child.id in settledResults ? (
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
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
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
            
            <div className="max-h-[80vh] overflow-y-auto space-y-12 pb-4">
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

              {/* ポイント合計のグラフ */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold mb-6 text-green-600">こどもべつポイントごうけい</h3>
                <div className="h-[300px]">
                  <Bar data={pointChartData} options={pointChartOptions} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                  {Object.entries(getPointStats()).map(([childName, points]) => {
                    const child = children.find(c => c.name === childName);
                    if (!child) return null;
                    return (
                      <div key={childName} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="font-bold text-lg mb-2" style={{ color: child.color }}>{childName}</div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">ごうけい</span>
                          <span className="text-xl font-bold" style={{ color: child.color }}>{points}ポイント</span>
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

              {/* 曜日別のグラフ */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold mb-6 text-purple-600">曜日別おてつだいかいすう</h3>
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                  <div className="w-full md:w-1/2 h-[300px]">
                    <Pie data={weekdayChartData} options={pieChartOptions} />
                  </div>
                  <div className="w-full md:w-1/2">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <h4 className="font-bold text-lg mb-3 text-purple-600">曜日別まとめ</h4>
                      <div className="space-y-2">
                        {Object.entries(getWeekdayStats()).map(([day, count]) => (
                          <div key={day} className="flex justify-between items-center">
                            <span className="text-gray-600">{day}</span>
                            <span className="font-bold text-purple-600">{count}かい</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 時間帯別のグラフ */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold mb-6 text-indigo-600">時間帯別おてつだいかいすう</h3>
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                  <div className="w-full md:w-1/2 h-[300px]">
                    <Pie data={timeChartData} options={pieChartOptions} />
                  </div>
                  <div className="w-full md:w-1/2">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <h4 className="font-bold text-lg mb-3 text-indigo-600">時間帯別まとめ</h4>
                      <div className="space-y-2">
                        {Object.entries(getTimeStats()).map(([time, count]) => (
                          <div key={time} className="flex justify-between items-center">
                            <span className="text-gray-600">{time}</span>
                            <span className="font-bold text-indigo-600">{count}かい</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
