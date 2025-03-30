import React, { createContext, useContext, useEffect, useState } from 'react';
import { Child, Chore, CompletedChore } from '@/types';
import defaultChores from '@/data/chores';
import defaultChildren from '@/data/children';
import { v4 as uuidv4 } from 'uuid';
import { loadFromStorage, saveToStorage } from '@/utils/storageUtils';

// コンテキストの型定義
interface AppContextType {
  // 子ども関連
  children: Child[];
  selectedChildId: string | null;
  setSelectedChildId: (id: string | null) => void;
  addChild: (name: string, color: string, avatar: string) => void;
  updateChild: (id: string, updates: Partial<Child>) => void;
  deleteChild: (id: string) => void;
  resetChildPoints: (id: string) => void;
  getChildById: (childId: string) => Child | undefined;

  // お手伝い関連
  chores: Chore[];
  addChore: (chore: Omit<Chore, 'id'>) => void;
  updateChore: (id: string, updates: Partial<Chore>) => void;
  deleteChore: (id: string) => void;
  
  // お手伝い履歴関連
  addCompletedChore: (childId: string, choreId: string, points: number) => void;
  deleteCompletedChore: (id: string) => void;
  getUnsettledChores: (childId: string) => CompletedChore[];
  getSettledChores: (childId: string) => CompletedChore[];
  getChildCompletedChores: (childId: string) => CompletedChore[];
  getSharedHistory: () => CompletedChore[];
  
  // ポイント清算
  settleChildPoints: (id: string) => number;
  settlePoints: (id: string) => number;
  
  // バックアップと復元
  exportData: () => string;
  importData: (jsonData: string) => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 状態の定義
  const [childrenList, setChildrenList] = useState<Child[]>(() => 
    loadFromStorage('children', defaultChildren)
  );
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [choresList, setChoresList] = useState<Chore[]>(() => 
    loadFromStorage('chores', defaultChores)
  );
  const [completedChores, setCompletedChores] = useState<CompletedChore[]>(() => 
    loadFromStorage('completedChores', [])
  );

  // データが変更されたらローカルストレージに保存
  useEffect(() => {
    saveToStorage('children', childrenList);
    saveToStorage('chores', choresList);
    saveToStorage('completedChores', completedChores);
  }, [childrenList, choresList, completedChores]);

  // ========== 子ども関連の関数 ==========
  
  // 子どもを追加
  const addChild = (name: string, color: string, avatar: string) => {
    const newChild: Child = {
      id: uuidv4(),
      name,
      color,
      avatar,
      totalPoints: 0,
    };
    setChildrenList([...childrenList, newChild]);
  };

  // 子どもを更新
  const updateChild = (id: string, updates: Partial<Child>) => {
    setChildrenList(
      childrenList.map((child) => (child.id === id ? { ...child, ...updates } : child))
    );
  };

  // 子どもを削除
  const deleteChild = (id: string) => {
    setChildrenList(childrenList.filter((child) => child.id !== id));
    // 関連するお手伝い履歴も削除
    setCompletedChores(completedChores.filter((chore) => chore.childId !== id));
  };

  // 子どものIDから子どもの情報を取得
  const getChildById = (childId: string): Child | undefined => {
    return childrenList.find(child => child.id === childId);
  };

  // 子どものポイントをリセット
  const resetChildPoints = (id: string) => {
    setChildrenList(
      childrenList.map((child) => (child.id === id ? { ...child, totalPoints: 0 } : child))
    );
    // 関連するお手伝い履歴も削除
    setCompletedChores(completedChores.filter((chore) => chore.childId !== id));
  };

  // ========== お手伝い関連の関数 ==========
  
  // お手伝いを追加
  const addChore = (chore: Omit<Chore, 'id'>) => {
    const newChore: Chore = {
      id: uuidv4(),
      ...chore,
    };
    setChoresList([...choresList, newChore]);
  };

  // お手伝いを更新
  const updateChore = (id: string, updates: Partial<Chore>) => {
    setChoresList(
      choresList.map((chore) => (chore.id === id ? { ...chore, ...updates } : chore))
    );
  };

  // お手伝いを削除
  const deleteChore = (id: string) => {
    setChoresList(choresList.filter((chore) => chore.id !== id));
    // 関連するお手伝い履歴も削除
    setCompletedChores(completedChores.filter((chore) => chore.choreId !== id));
  };

  // ========== お手伝い履歴関連の関数 ==========
  
  // 完了したお手伝いを追加
  const addCompletedChore = (childId: string, choreId: string, points: number) => {
    const chore = choresList.find(c => c.id === choreId);
    if (!chore) return;
    
    const newCompletedChore: CompletedChore = {
      id: uuidv4(),
      childId,
      choreId,
      choreName: chore.name,
      points,
      timestamp: new Date().toISOString(),
      isSettled: false,
    };
    
    setCompletedChores([...completedChores, newCompletedChore]);
  };

  // 完了したお手伝いを削除
  const deleteCompletedChore = (id: string) => {
    setCompletedChores(completedChores.filter((chore) => chore.id !== id));
  };

  // 特定の子どもの未集計のお手伝い履歴を取得
  const getUnsettledChores = (childId: string) => {
    return completedChores.filter(
      (chore) => chore.childId === childId && !chore.isSettled
    );
  };

  // 特定の子どもの集計済みのお手伝い履歴を取得
  const getSettledChores = (childId: string) => {
    return completedChores.filter(
      (chore) => chore.childId === childId && chore.isSettled
    );
  };

  // 特定の子どもの全てのお手伝い履歴を取得
  const getChildCompletedChores = (childId: string) => {
    return completedChores.filter(chore => chore.childId === childId);
  };

  // 全ての子どもの履歴を取得（最新順）
  const getSharedHistory = () => {
    try {
      return [...completedChores].sort((a, b) => {
        try {
          const dateA = new Date(a.timestamp);
          const dateB = new Date(b.timestamp);
          
          // 無効な日付値をチェック
          if (isNaN(dateA.getTime())) {
            console.error('Invalid date in sorting (A):', a.timestamp);
            return 1; // 不正な日付は後ろに表示
          }
          
          if (isNaN(dateB.getTime())) {
            console.error('Invalid date in sorting (B):', b.timestamp);
            return -1; // 不正な日付は後ろに表示
          }
          
          return dateB.getTime() - dateA.getTime();
        } catch (error) {
          console.error('Error comparing dates:', a.timestamp, b.timestamp, error);
          return 0;
        }
      });
    } catch (error) {
      console.error('Error sorting shared history:', error);
      return [];
    }
  };

  // ========== ポイント清算関連の関数 ==========
  
  // 子どもの未集計ポイントを集計
  const settleChildPoints = (id: string): number => {
    // 未集計のお手伝いを取得
    const allUnsettledChores = completedChores.filter(
      (chore) => chore.childId === id && !chore.isSettled
    );
    
    if (allUnsettledChores.length === 0) {
      return 0;
    }
    
    // 未集計ポイントの合計を計算
    const totalUnsettledPoints = allUnsettledChores.reduce((sum, chore) => sum + chore.points, 0);
    
    // 集計済みに変更するお手伝いのIDリスト
    const choreIdsToSettle = allUnsettledChores.map(chore => chore.id);
    
    // 未集計のお手伝いを集計済みに更新
    const updatedCompletedChores = completedChores.map((chore) => {
      if (choreIdsToSettle.includes(chore.id)) {
        return {
          ...chore,
          isSettled: true
        };
      }
      return chore;
    });
    
    // 子どもの合計ポイントに追加
    const updatedChildrenList = childrenList.map((child) => {
      if (child.id === id) {
        return {
          ...child,
          totalPoints: child.totalPoints + totalUnsettledPoints
        };
      }
      return child;
    });
    
    // 状態を更新
    setChildrenList(updatedChildrenList);
    setCompletedChores(updatedCompletedChores);
    
    return totalUnsettledPoints;
  };

  // 後方互換性のために settlePoints という名前でも提供
  const settlePoints = settleChildPoints;

  // ========== バックアップと復元関連の関数 ==========
  
  // データをエクスポート
  const exportData = () => {
    const data = {
      children: childrenList,
      chores: choresList,
      completedChores: completedChores,
      version: '1.0',
      timestamp: new Date().toISOString()
    };
    
    return JSON.stringify(data);
  };
  
  // データをインポート
  const importData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      
      // バリデーション
      if (!data.children || !Array.isArray(data.children) || 
          !data.chores || !Array.isArray(data.chores) || 
          !data.completedChores || !Array.isArray(data.completedChores)) {
        return false;
      }
      
      // データを更新
      setChildrenList(data.children);
      setChoresList(data.chores);
      setCompletedChores(data.completedChores);
      
      return true;
    } catch (error) {
      console.error('データのインポートに失敗しました:', error);
      return false;
    }
  };

  // コンテキスト値の作成
  const value: AppContextType = {
    children: childrenList,
    selectedChildId,
    setSelectedChildId,
    addChild,
    updateChild,
    deleteChild,
    resetChildPoints,
    getChildById,
    
    chores: choresList,
    addChore,
    updateChore,
    deleteChore,
    
    addCompletedChore,
    deleteCompletedChore,
    getUnsettledChores,
    getSettledChores,
    getChildCompletedChores,
    getSharedHistory,
    
    settleChildPoints,
    settlePoints,
    
    exportData,
    importData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext; 