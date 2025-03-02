import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Child, ChoreType, CompletedChore } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// デフォルトのお手伝いリスト
const defaultChores: ChoreType[] = [
  { id: '1', name: 'おふとんをたたむ', points: 5, iconName: 'bed' },
  { id: '2', name: 'しょっきをあらう', points: 10, iconName: 'dish' },
  { id: '3', name: 'そうじをする', points: 8, iconName: 'broom' },
  { id: '4', name: 'ごみをだす', points: 5, iconName: 'trash' },
  { id: '5', name: 'せんたくものをたたむ', points: 7, iconName: 'shirt' },
  { id: '6', name: 'おかたづけをする', points: 6, iconName: 'box' },
];

// デフォルトの子どもたち
const defaultChildren: Child[] = [
  {
    id: '1',
    name: 'こども1',
    totalPoints: 0,
    color: '#4dabf7', // 青系
    avatar: 'smile',
  },
  {
    id: '2',
    name: 'こども2',
    totalPoints: 0,
    color: '#ff922b', // オレンジ系
    avatar: 'heart',
  },
];

// デフォルトの完了したお手伝い
const defaultCompletedChores: CompletedChore[] = [];

type AppContextType = {
  chores: ChoreType[];
  children: Child[];
  completedChores: CompletedChore[];
  selectedChildId: string;
  setSelectedChildId: (id: string) => void;
  addCompletedChore: (choreId: string, childId: string) => void;
  resetPoints: (childId: string) => void;
  resetAllPoints: () => void;
  addChore: (chore: Omit<ChoreType, 'id'>) => void;
  deleteChore: (choreId: string) => void;
  updateChildName: (childId: string, name: string) => void;
  updateChildAvatar: (childId: string, avatar: string) => void;
  updateChildColor: (childId: string, color: string) => void;
  addChild: (name: string) => void;
  deleteChild: (childId: string) => void;
  getChildCompletedChores: (childId: string) => CompletedChore[];
  getUnsettledChores: (childId: string) => CompletedChore[];
  getSettledChores: (childId: string) => CompletedChore[];
  settlePoints: (childId: string) => number;
  deleteCompletedChore: (completedChoreId: string) => void;
  exportData: () => void;
  importData: (jsonData: string) => boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [chores, setChores] = useState<ChoreType[]>(defaultChores);
  const [childrenList, setChildrenList] = useState<Child[]>(defaultChildren);
  const [completedChores, setCompletedChores] = useState<CompletedChore[]>(defaultCompletedChores);
  const [selectedChildId, setSelectedChildId] = useState<string>(defaultChildren[0].id);

  // ローカルストレージからデータを読み込む
  useEffect(() => {
    try {
      const savedChores = localStorage.getItem('chores');
      const savedChildren = localStorage.getItem('children');
      const savedCompletedChores = localStorage.getItem('completedChores');
      const savedSelectedChildId = localStorage.getItem('selectedChildId');

      if (savedChores) {
        setChores(JSON.parse(savedChores));
      }

      if (savedChildren) {
        setChildrenList(JSON.parse(savedChildren));
      }

      if (savedCompletedChores) {
        const parsedCompletedChores = JSON.parse(savedCompletedChores);
        // Date オブジェクトを復元
        const restoredCompletedChores = parsedCompletedChores.map((chore: any) => ({
          ...chore,
          completedAt: new Date(chore.completedAt),
        }));
        setCompletedChores(restoredCompletedChores);
      }

      if (savedSelectedChildId) {
        setSelectedChildId(savedSelectedChildId);
      }
    } catch (error) {
      console.error('ローカルストレージからのデータ読み込みに失敗しました:', error);
      // エラーが発生した場合はデフォルト値を使用
    }
  }, []);

  // データが変更されたらローカルストレージに保存
  useEffect(() => {
    try {
      localStorage.setItem('chores', JSON.stringify(chores));
      localStorage.setItem('children', JSON.stringify(childrenList));
      localStorage.setItem('completedChores', JSON.stringify(completedChores));
      localStorage.setItem('selectedChildId', selectedChildId);
    } catch (error) {
      console.error('ローカルストレージへのデータ保存に失敗しました:', error);
      alert('データの保存に失敗しました。ブラウザの設定を確認してください。');
    }
  }, [chores, childrenList, completedChores, selectedChildId]);

  // データをJSONファイルとしてエクスポート
  const exportData = () => {
    try {
      const data = {
        chores,
        children: childrenList,
        completedChores,
        selectedChildId,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `おてつだいアプリ_${new Date().toLocaleDateString('ja-JP')}.json`;
      document.body.appendChild(a);
      a.click();
      
      // クリーンアップ
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
    } catch (error) {
      console.error('データのエクスポートに失敗しました:', error);
      alert('データのエクスポートに失敗しました。');
    }
  };

  // JSONデータをインポート
  const importData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      
      // データの検証
      if (!data.chores || !data.children || !data.completedChores) {
        throw new Error('データの形式が正しくありません');
      }
      
      // データをセット
      setChores(data.chores);
      setChildrenList(data.children);
      
      // Date オブジェクトを復元
      const restoredCompletedChores = data.completedChores.map((chore: any) => ({
        ...chore,
        completedAt: new Date(chore.completedAt),
      }));
      setCompletedChores(restoredCompletedChores);
      
      // 選択中の子どもIDをセット（存在する子どもIDであることを確認）
      if (data.selectedChildId && data.children.some((child: Child) => child.id === data.selectedChildId)) {
        setSelectedChildId(data.selectedChildId);
      } else if (data.children.length > 0) {
        setSelectedChildId(data.children[0].id);
      }
      
      return true;
    } catch (error) {
      console.error('データのインポートに失敗しました:', error);
      alert('データのインポートに失敗しました。ファイル形式を確認してください。');
      return false;
    }
  };

  // 特定の子どものお手伝い履歴を取得
  const getChildCompletedChores = (childId: string) => {
    return completedChores.filter(chore => chore.childId === childId);
  };

  // お手伝い完了を記録
  const addCompletedChore = (choreId: string, childId: string) => {
    const chore = chores.find(c => c.id === choreId);
    if (!chore) return;

    const newCompletedChore: CompletedChore = {
      id: uuidv4(),
      choreId,
      childId,
      completedAt: new Date(),
      points: chore.points,
      settled: false, // 初期状態は未集計
    };

    setCompletedChores(prev => [...prev, newCompletedChore]);

    // 子どものポイントを更新
    setChildrenList(prev => 
      prev.map(child => 
        child.id === childId 
          ? { ...child, totalPoints: child.totalPoints + chore.points } 
          : child
      )
    );
  };

  // 特定の子どものポイントをリセット
  const resetPoints = (childId: string) => {
    setChildrenList(prev => 
      prev.map(child => 
        child.id === childId 
          ? { ...child, totalPoints: 0 } 
          : child
      )
    );
    
    // その子どものお手伝い履歴を削除
    setCompletedChores(prev => prev.filter(chore => chore.childId !== childId));
  };

  // 全ての子どものポイントをリセット
  const resetAllPoints = () => {
    setChildrenList(prev => 
      prev.map(child => ({ ...child, totalPoints: 0 }))
    );
    setCompletedChores([]);
  };

  // 新しいお手伝いを追加
  const addChore = (chore: Omit<ChoreType, 'id'>) => {
    const newChore: ChoreType = {
      ...chore,
      id: uuidv4(),
    };
    setChores(prev => [...prev, newChore]);
  };

  // お手伝いを削除
  const deleteChore = (choreId: string) => {
    setChores(prev => prev.filter(chore => chore.id !== choreId));
    // 関連するお手伝い履歴も削除
    setCompletedChores(prev => prev.filter(chore => chore.choreId !== choreId));
  };

  // 子どもの名前を更新
  const updateChildName = (childId: string, name: string) => {
    setChildrenList(prev => 
      prev.map(child => 
        child.id === childId 
          ? { ...child, name } 
          : child
      )
    );
  };

  // 子どものアバターを更新
  const updateChildAvatar = (childId: string, avatar: string) => {
    setChildrenList(prev => 
      prev.map(child => 
        child.id === childId 
          ? { ...child, avatar } 
          : child
      )
    );
  };

  // 子どものカラーを更新
  const updateChildColor = (childId: string, color: string) => {
    setChildrenList(prev => 
      prev.map(child => 
        child.id === childId 
          ? { ...child, color } 
          : child
      )
    );
  };

  // 新しい子どもを追加
  const addChild = (name: string) => {
    const newChild: Child = {
      id: uuidv4(),
      name,
      totalPoints: 0,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`, // ランダムな色
      avatar: 'smile',
    };
    setChildrenList(prev => [...prev, newChild]);
  };

  // 子どもを削除
  const deleteChild = (childId: string) => {
    // 最低1人は残す
    if (childrenList.length <= 1) return;
    
    setChildrenList(prev => prev.filter(child => child.id !== childId));
    
    // 関連するお手伝い履歴も削除
    setCompletedChores(prev => prev.filter(chore => chore.childId !== childId));
    
    // 削除した子どもが選択されていた場合、別の子どもを選択
    if (selectedChildId === childId) {
      const remainingChildren = childrenList.filter(child => child.id !== childId);
      if (remainingChildren.length > 0) {
        setSelectedChildId(remainingChildren[0].id);
      }
    }
  };

  // 特定の子どもの未集計のお手伝い履歴を取得
  const getUnsettledChores = (childId: string) => {
    return completedChores.filter(chore => chore.childId === childId && !chore.settled);
  };

  // 特定の子どもの集計済みのお手伝い履歴を取得
  const getSettledChores = (childId: string) => {
    return completedChores.filter(chore => chore.childId === childId && chore.settled);
  };

  // 完了したお手伝いを削除する
  const deleteCompletedChore = (completedChoreId: string) => {
    setCompletedChores(prev => prev.filter(chore => chore.id !== completedChoreId));
    
    // 削除するお手伝いの情報を取得
    const choreToDelete = completedChores.find(chore => chore.id === completedChoreId);
    
    if (choreToDelete) {
      // 子どものポイントから削除するお手伝いのポイントを引く
      setChildrenList(prev => 
        prev.map(child => 
          child.id === choreToDelete.childId 
            ? { ...child, totalPoints: child.totalPoints - choreToDelete.points } 
            : child
        )
      );
    }
  };

  // 特定の子どもの未集計ポイントを集計する
  const settlePoints = (childId: string) => {
    const unsettledChores = getUnsettledChores(childId);
    if (unsettledChores.length === 0) return 0;

    // 未集計のポイント合計を計算
    const totalUnsettledPoints = unsettledChores.reduce((sum, chore) => sum + chore.points, 0);

    // 未集計のお手伝いを集計済みに更新
    setCompletedChores(prev => 
      prev.map(chore => 
        chore.childId === childId && !chore.settled
          ? { ...chore, settled: true }
          : chore
      )
    );

    return totalUnsettledPoints;
  };

  return (
    <AppContext.Provider
      value={{
        chores,
        children: childrenList,
        completedChores,
        selectedChildId,
        setSelectedChildId,
        addCompletedChore,
        resetPoints,
        resetAllPoints,
        addChore,
        deleteChore,
        updateChildName,
        updateChildAvatar,
        updateChildColor,
        addChild,
        deleteChild,
        getChildCompletedChores,
        getUnsettledChores,
        getSettledChores,
        settlePoints,
        deleteCompletedChore,
        exportData,
        importData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 