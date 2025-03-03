import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Icon from './Icon';
import { CompletedChore } from '@/types';

const HistoryList: React.FC = () => {
  const { 
    chores, 
    selectedChildId, 
    getUnsettledChores, 
    getSettledChores, 
    deleteCompletedChore 
  } = useApp();
  const [activeTab, setActiveTab] = useState<'unsettled' | 'settled'>('unsettled');

  // 選択された子どもの未集計のお手伝い履歴を取得
  const unsettledChores = getUnsettledChores(selectedChildId);
  
  // 選択された子どもの集計済みのお手伝い履歴を取得
  const settledChores = getSettledChores(selectedChildId);

  // 表示するお手伝い履歴を選択
  const displayChores = activeTab === 'unsettled' ? unsettledChores : settledChores;

  // 最新の履歴を表示（全て表示）
  const sortedCompletedChores = [...displayChores]
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

  // お手伝いの削除を処理する関数
  const handleDeleteChore = (choreId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    deleteCompletedChore(choreId);
  };

  // お手伝いリストを表示
  const renderChoresList = (completedChores: CompletedChore[]) => {
    if (completedChores.length === 0) {
      return (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Icon name={activeTab === 'unsettled' ? 'box' : 'calendar'} size={40} color="#adb5bd" className="mx-auto mb-3" />
          <p className="text-gray-500">
            {activeTab === 'unsettled' 
              ? 'まだおてつだいの記録がありません' 
              : 'しゅうけいずみのおてつだいがありません'}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2 max-h-110 overflow-y-auto pr-1 custom-scrollbar">
        {completedChores.map((completedChore) => {
          const chore = chores.find((c) => c.id === completedChore.choreId);
          if (!chore) return null;

          const date = new Date(completedChore.completedAt);
          const formattedDate = `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;

          return (
            <div 
              key={completedChore.id} 
              className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full" style={{ backgroundColor: activeTab === 'unsettled' ? '#e3f2fd' : '#e8f5e9' }}>
                  <Icon 
                    name={chore.iconName} 
                    size={22} 
                    color={activeTab === 'unsettled' ? '#2196f3' : '#4caf50'} 
                  />
                </div>
                <div>
                  <p className="font-bold text-base">{chore.name}</p>
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    <Icon name="calendar" size={12} className="mr-1" color="#adb5bd" />
                    {formattedDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded-full">
                  <Icon name="star" size={12} color="#ffd43b" />
                  <span className="font-bold">{completedChore.points}</span>
                </div>
                
                {/* 未集計のお手伝いにのみ削除ボタンを表示 */}
                {activeTab === 'unsettled' && (
                  <button 
                    onClick={(e) => handleDeleteChore(completedChore.id, e)}
                    className="p-1 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
                    title="削除"
                  >
                    <Icon name="trash" size={14} color="#f44336" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="mt-6 card shadow-md hover:shadow-lg transition-shadow h-140">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold flex items-center">
          <Icon name="box" size={22} color="#4dabf7" className="mr-2" />
          おてつだいりれき
        </h2>
      </div>
      
      {/* タブ切り替え */}
      <div className="flex border-b mb-3">
        <button
          className={`flex-1 py-2 text-center transition-colors ${
            activeTab === 'unsettled' 
              ? 'border-b-2 border-blue-500 font-bold text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('unsettled')}
        >
          <div className="flex items-center justify-center">
            <Icon 
              name="box" 
              size={16} 
              color={activeTab === 'unsettled' ? '#2196f3' : '#adb5bd'} 
              className="mr-1" 
            />
            みしゅうけい
          </div>
        </button>
        <button
          className={`flex-1 py-2 text-center transition-colors ${
            activeTab === 'settled' 
              ? 'border-b-2 border-green-500 font-bold text-green-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('settled')}
        >
          <div className="flex items-center justify-center">
            <Icon 
              name="calendar" 
              size={16} 
              color={activeTab === 'settled' ? '#4caf50' : '#adb5bd'} 
              className="mr-1" 
            />
            しゅうけいずみ
          </div>
        </button>
      </div>
      
      {renderChoresList(sortedCompletedChores)}
    </div>
  );
};

export default HistoryList; 