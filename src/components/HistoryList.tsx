import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Icon from './Icon';
import { CompletedChore } from '@/types';

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
};

// お手伝いのカテゴリに対応する絵文字
const categoryEmojiMap: {[key: string]: string} = {
  '掃除': '🧹',
  '料理': '🍳',
  '洗濯': '🧺',
  '買い物': '🛒',
  '片付け': '📦',
  '手伝い': '🤝',
  'その他': '📝',
  // デフォルト
  'default': '✨',
};

const HistoryList: React.FC = () => {
  const { 
    children, 
    getUnsettledChores, 
    getSettledChores, 
    deleteCompletedChore,
    getSharedHistory,
    getChildById
  } = useApp();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [animatedItems, setAnimatedItems] = useState<{[key: string]: boolean}>({});
  
  // 履歴一覧を取得
  const history = getSharedHistory();

  // 履歴を日付でグループ化する
  const groupedHistory = history.reduce<{ [date: string]: CompletedChore[] }>((acc, item) => {
    try {
      // 日付だけの文字列に変換（時間は含めない）
      // timestamp が無効な値でないかチェック
      if (!item.timestamp) {
        console.error('Invalid timestamp found:', item);
        return acc;
      }
      
      const date = new Date(item.timestamp);
      
      // 無効な日付値をチェック
      if (isNaN(date.getTime())) {
        console.error('Invalid date found:', item.timestamp);
        return acc;
      }
      
      const dateStr = date.toISOString().split('T')[0];
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(item);
    } catch (error) {
      console.error('Error processing history item:', item, error);
    }
    return acc;
  }, {});

  // 日付の降順でソートされた日付一覧
  const sortedDates = Object.keys(groupedHistory).sort((a, b) => {
    try {
      return new Date(b).getTime() - new Date(a).getTime();
    } catch (error) {
      console.error('Error sorting dates:', a, b, error);
      return 0;
    }
  });

  // 子供の情報を取得する関数
  const getChildInfo = (childId: string) => {
    return getChildById(childId);
  };

  // フィルタリングされた履歴を取得
  const filteredHistory = activeTab === 'all' 
    ? history 
    : history.filter(item => item.childId === activeTab);

  // 項目をクリックしたときのアニメーション処理
  const handleItemClick = (historyId: string) => {
    // アニメーション状態を更新
    setAnimatedItems(prev => ({
      ...prev,
      [historyId]: true
    }));
    
    // アニメーション終了後に状態をリセット
    setTimeout(() => {
      setAnimatedItems(prev => ({
        ...prev,
        [historyId]: false
      }));
    }, 700);
  };

  // 日付を整形する関数
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      
      // 無効な日付値をチェック
      if (isNaN(date.getTime())) {
        console.error('Invalid date in formatDate:', dateStr);
        return '不明な日付';
      }
      
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekday = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
      return `${month}月${day}日 (${weekday})`;
    } catch (error) {
      console.error('Error formatting date:', dateStr, error);
      return '不明な日付';
    }
  };

  // 時間を整形する関数
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      
      // 無効な日付値をチェック
      if (isNaN(date.getTime())) {
        console.error('Invalid date in formatTime:', timestamp);
        return '--:--';
      }
      
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (error) {
      console.error('Error formatting time:', timestamp, error);
      return '--:--';
    }
  };

  return (
    <div className="card shadow-sm hover:shadow-md transition-shadow border border-purple-100 h-full rounded-xl overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="p-2 pb-0">
          <div className="flex items-center mb-2">
            <h2 className="text-lg font-bold flex items-center gap-1">
              <span className="text-xl bounce-custom" style={{ display: 'inline-block' }}>📝</span>
              <span className="text-purple-700">お手伝い履歴</span>
            </h2>
          </div>
          
          {/* タブ切り替え */}
          <div className="flex space-x-1 mb-2 overflow-x-auto pb-1 scrollbar-custom">
            <button
              className={`px-3 py-1 text-sm rounded-full transition-all ${
                activeTab === 'all' 
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
              onClick={() => setActiveTab('all')}
            >
              <span className="mr-1">👨‍👩‍👧‍👦</span>
              みんな
            </button>
            
            {children.map(child => (
              <button
                key={child.id}
                className={`px-3 py-1 text-sm rounded-full transition-all flex items-center ${
                  activeTab === child.id 
                    ? 'shadow-md' 
                    : 'hover:bg-opacity-80'
                }`}
                style={{ 
                  backgroundColor: activeTab === child.id ? `${child.color}` : `${child.color}30`,
                  color: activeTab === child.id ? 'white' : `${child.color}`
                }}
                onClick={() => setActiveTab(child.id)}
              >
                <span className="mr-1">{childEmojiMap[child.avatar] || '👤'}</span>
                {child.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* 履歴リスト */}
        <div className="flex-1 overflow-y-auto p-2 pt-0 scrollbar-custom dotted-bg">
          {filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <span className="text-4xl mb-2 float">📭</span>
              <p className="text-sm">まだお手伝いの記録がありません</p>
              <p className="text-xs mt-1">おてつだいをしてポイントをためましょう！</p>
            </div>
          ) : (
            sortedDates.map(dateStr => {
              // この日付のデータをフィルタリング
              const itemsOnDate = activeTab === 'all' 
                ? groupedHistory[dateStr] 
                : groupedHistory[dateStr].filter(item => item.childId === activeTab);
              
              // フィルタリング後にアイテムがなければ表示しない
              if (itemsOnDate.length === 0) {
                return null;
              }
              
              return (
                <div key={dateStr} className="mb-3">
                  {/* 日付ヘッダー */}
                  <div className="sticky top-0 z-10 bg-purple-50 px-3 py-1 rounded-lg shadow-sm mb-2 flex items-center">
                    <span className="text-base mr-1">📅</span>
                    <span className="text-sm font-medium text-purple-700">
                      {formatDate(dateStr)}
                    </span>
                  </div>
                  
                  {/* この日の履歴アイテム */}
                  <div className="space-y-2">
                    {itemsOnDate.map((item, index) => {
                      const child = getChildInfo(item.childId);
                      if (!child) return null;
                      
                      // お手伝いのカテゴリに対応する絵文字を取得
                      let categoryEmoji = categoryEmojiMap.default;
                      for (const [category, emoji] of Object.entries(categoryEmojiMap)) {
                        if (item.choreName.includes(category)) {
                          categoryEmoji = emoji;
                          break;
                        }
                      }
                      
                      // アニメーション状態
                      const isAnimated = animatedItems[item.id];
                      
                      return (
                        <div 
                          key={`${dateStr}-${index}`}
                          className={`p-2 bg-white rounded-lg shadow-sm border-l-2 transition-all cursor-pointer 
                            ${isAnimated ? 'scale-105 shadow-md' : 'hover:shadow-md'}`}
                          style={{ borderLeftColor: child.color }}
                          onClick={() => handleItemClick(item.id)}
                        >
                          <div className="flex items-start">
                            <div 
                              className={`mr-2 text-xl ${isAnimated ? 'bounce-custom' : 'float'}`}
                              style={{ color: child.color }}
                            >
                              {categoryEmoji}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center">
                                <span className="text-sm font-medium">{item.choreName}</span>
                                {item.isSettled && (
                                  <span className="ml-1 text-xs bg-green-100 text-green-600 px-1 py-0.5 rounded-full">
                                    ゲット
                                  </span>
                                )}
                                {!item.isSettled && (
                                  <span className="ml-1 text-xs bg-blue-100 text-blue-600 px-1 py-0.5 rounded-full blink">
                                    ためてる
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center justify-between mt-0.5">
                                <div className="flex items-center text-xs text-gray-500">
                                  <span>{formatTime(item.timestamp)}</span>
                                </div>
                                
                                <div className="flex items-center">
                                  <div className="flex items-center mr-2 text-xs">
                                    <span 
                                      className="w-4 h-4 rounded-full flex items-center justify-center mr-1 text-xs"
                                      style={{ backgroundColor: child.color, color: 'white' }}
                                    >
                                      {childEmojiMap[child.avatar] || '👤'}
                                    </span>
                                    <span style={{ color: child.color }}>{child.name}</span>
                                  </div>
                                  
                                  <div 
                                    className={`flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isAnimated ? 'pulse-custom' : ''}`}
                                    style={{ 
                                      backgroundColor: `${child.color}20`,
                                      color: child.color
                                    }}
                                  >
                                    <span className="mr-0.5">⭐</span>
                                    {item.points}ポイント
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryList; 