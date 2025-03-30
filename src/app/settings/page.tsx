'use client';

import React, { useState, useRef } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import Link from 'next/link';
import { Child } from '@/types';
import { 
  childEmojiMap, 
  choreEmojiMap, 
  iconOptions, 
  avatarOptions, 
  colorOptions 
} from '@/utils/emojiMaps';
import EmojiSelector from '@/components/EmojiSelector';
import ColorSelector from '@/components/ColorSelector';

// 子ども編集フォーム
const ChildEditForm = ({ 
  name, 
  setName, 
  avatar, 
  setAvatar, 
  color, 
  setColor, 
  onSave, 
  onCancel 
}: {
  name: string;
  setName: (name: string) => void;
  avatar: string;
  setAvatar: (avatar: string) => void;
  color: string;
  setColor: (color: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) => {
  return (
    <div className="space-y-5">
      <div>
        <label className="block mb-2 font-bold">なまえ</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="こどものなまえ"
        />
      </div>
      
      <div>
        <label className="block mb-2 font-bold">アイコン</label>
        <EmojiSelector 
          options={avatarOptions}
          selectedValue={avatar}
          onChange={setAvatar}
        />
      </div>
      
      <div>
        <label className="block mb-2 font-bold">カラー</label>
        <ColorSelector 
          options={colorOptions}
          selectedValue={color}
          onChange={setColor}
        />
      </div>
      
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onCancel}
          className="bg-gray-200 hover:bg-gray-300 px-5 py-2.5 rounded-lg transition-colors font-medium"
        >
          キャンセル
        </button>
        <button
          onClick={onSave}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg transition-colors font-medium"
        >
          ほぞん
        </button>
      </div>
    </div>
  );
};

// 新しいお手伝い追加フォーム
const ChoreAddForm = ({
  name,
  setName,
  points,
  setPoints,
  icon,
  setIcon,
  onSubmit
}: {
  name: string;
  setName: (name: string) => void;
  points: number;
  setPoints: (points: number) => void;
  icon: string;
  setIcon: (icon: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="block mb-2 font-bold">なまえ</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="おてつだいのなまえ"
          required
        />
      </div>
      <div>
        <label className="block mb-2 font-bold">ポイント</label>
        <div className="flex items-center">
          <input
            type="number"
            min="1"
            max="20"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            required
          />
          <span className="ml-2 text-xl">⭐</span>
        </div>
      </div>
      <div>
        <label className="block mb-2 font-bold">アイコン</label>
        <EmojiSelector 
          options={iconOptions}
          selectedValue={icon}
          onChange={setIcon}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium shadow-sm hover:shadow transition-all mt-4"
      >
        ついか
      </button>
    </form>
  );
};

// パスワードモーダル
const PasswordModal = ({
  password,
  setPassword,
  passwordError,
  onCheck,
  onCancel
}: {
  password: string;
  setPassword: (password: string) => void;
  passwordError: boolean;
  onCheck: () => void;
  onCancel: () => void;
}) => {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
        <h2 className="text-xl font-bold mb-5 flex items-center">
          <span className="text-2xl mr-2">🔒</span>
          パスワードにゅうりょく
        </h2>
        
        <div className="mb-5">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onCheck()}
            className={`w-full p-4 border rounded-lg text-center text-2xl ${passwordError ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="＊＊＊＊"
            autoFocus
          />
          {passwordError && (
            <p className="text-red-500 text-center mt-2 font-medium">パスワードがちがいます</p>
          )}
        </div>
        
        <div className="flex justify-between gap-4">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 px-4 py-3 rounded-lg font-medium transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={onCheck}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            かくにん
          </button>
        </div>
      </div>
    </div>
  );
};

// 設定ページのコンテンツ
const SettingsContent = () => {
  const { 
    children, 
    selectedChildId, 
    setSelectedChildId,
    updateChild,
    chores, 
    addChore,
    deleteChore,
    getChildById,
    exportData,
    importData,
  } = useApp();

  // パスワード関連の状態
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 選択された子ども
  const selectedChild = children.find(child => child.id === selectedChildId);
  
  // 新しいお手伝い用の状態
  const [newChoreName, setNewChoreName] = useState('');
  const [newChorePoints, setNewChorePoints] = useState(5);
  const [newChoreIcon, setNewChoreIcon] = useState('star');
  
  // 子どもの編集用の状態
  const [editingChildName, setEditingChildName] = useState('');
  const [editingChildAvatar, setEditingChildAvatar] = useState('');
  const [editingChildColor, setEditingChildColor] = useState('');
  const [isEditingChild, setIsEditingChild] = useState(false);

  // バックアップ・復元関係の状態
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 子どもの編集を開始
  const startEditingChild = (child: Child) => {
    setSelectedChildId(child.id);
    setEditingChildName(child.name);
    setEditingChildAvatar(child.avatar);
    setEditingChildColor(child.color);
    setIsEditingChild(true);
  };

  // 子どもの編集を保存
  const saveChildEdit = () => {
    if (editingChildName.trim() && selectedChildId) {
      updateChild(selectedChildId, {
        name: editingChildName,
        avatar: editingChildAvatar,
        color: editingChildColor
      });
      setIsEditingChild(false);
      alert('こどもの情報をほぞんしました！');
    }
  };

  // パスワード確認処理
  const handlePasswordCheck = () => {
    if (password === '1234') {
      setShowPasswordModal(false);
      setIsAuthenticated(true);
      setPassword('');
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  // 認証が必要な操作を実行する前にパスワード確認
  const handleProtectedAction = (action: () => void) => {
    if (isAuthenticated) {
      action();
    } else {
      setShowPasswordModal(true);
    }
  };

  // お手伝いの追加処理
  const handleAddChore = (e: React.FormEvent) => {
    e.preventDefault();
    handleProtectedAction(() => {
      if (newChoreName.trim()) {
        addChore({
          name: newChoreName,
          points: newChorePoints,
          iconName: newChoreIcon,
        });
        setNewChoreName('');
        setNewChorePoints(5);
        alert('あたらしいおてつだいをついかしました！');
      }
    });
  };

  // お手伝いの削除処理
  const handleDeleteChore = (choreId: string) => {
    handleProtectedAction(() => {
      if (window.confirm('このおてつだいをけしますか？')) {
        deleteChore(choreId);
        alert('おてつだいをけしました！');
      }
    });
  };

  // データをエクスポートする処理
  const handleExportData = () => {
    handleProtectedAction(() => {
      try {
        const jsonData = exportData();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonData);
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        downloadAnchorNode.setAttribute("download", `kids-app-backup-${date}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        alert('データのバックアップが完了しました！');
      } catch (error) {
        console.error('バックアップエラー:', error);
        alert('バックアップに失敗しました。もう一度お試しください。');
      }
    });
  };

  // ファイル選択時の処理
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        const success = importData(jsonData);
        
        if (success) {
          setImportStatus('success');
          alert('データの復元が完了しました！');
        } else {
          setImportStatus('error');
          alert('データの形式が正しくありません。有効なバックアップファイルを選択してください。');
        }
      } catch (error) {
        console.error('復元エラー:', error);
        setImportStatus('error');
        alert('データの復元に失敗しました。もう一度お試しください。');
      }
      
      // ファイル入力をリセット
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    reader.readAsText(file);
  };

  // ファイル選択ダイアログを開く
  const handleImportClick = () => {
    handleProtectedAction(() => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8 bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl shadow-md">
        <div className="flex items-center">
          <span className="text-3xl mr-3">⚙️</span>
          <h1 className="text-2xl font-bold text-white">せっていページ</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/" className="flex items-center gap-2 bg-white hover:bg-gray-100 text-blue-600 px-5 py-2 rounded-full shadow-sm transition-all">
            <span className="text-lg">🏠</span> もどる
          </Link>
        </div>
      </header>

      <div className="space-y-8">
        {/* 子どもの管理 */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-bold mb-5 flex items-center"><span className="text-xl mr-2">👨‍👩‍👧‍👦</span>こどものかんり</h2>
          
          {/* 子どもリスト */}
          <div className="space-y-4">
            {children.map((child) => {
              const emoji = childEmojiMap[child.avatar] || '👤';
              return (
                <div 
                  key={child.id} 
                  className="flex items-center justify-between p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all"
                  style={{ backgroundColor: `${child.color}10` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl" style={{ color: child.color }}>{emoji}</span>
                    <div>
                      <p className="font-bold text-lg">{child.name}</p>
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full inline-flex mt-1">
                        <span className="text-sm">⭐</span>
                        <span className="text-sm font-medium">{child.totalPoints}ポイント</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => startEditingChild(child)}
                      className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      へんしゅう
                    </button>
                  </div>
                </div>
              );
            })}

            {children.length === 0 && (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <p>こどもがとうろくされていません</p>
              </div>
            )}
          </div>
        </div>

        {/* 子ども編集フォーム */}
        {isEditingChild && selectedChild && (
          <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100">
            <h2 className="text-xl font-bold mb-5 flex items-center text-blue-600">
              <span className="text-xl mr-2">✏️</span>こどもをへんしゅう
            </h2>
            <ChildEditForm 
              name={editingChildName}
              setName={setEditingChildName}
              avatar={editingChildAvatar}
              setAvatar={setEditingChildAvatar}
              color={editingChildColor}
              setColor={setEditingChildColor}
              onSave={saveChildEdit}
              onCancel={() => setIsEditingChild(false)}
            />
          </div>
        )}

        {/* お手伝い追加フォーム */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-bold mb-5 flex items-center"><span className="text-xl mr-2">✨</span>あたらしいおてつだい</h2>
          <ChoreAddForm 
            name={newChoreName}
            setName={setNewChoreName}
            points={newChorePoints}
            setPoints={setNewChorePoints}
            icon={newChoreIcon}
            setIcon={setNewChoreIcon}
            onSubmit={handleAddChore}
          />
        </div>

        {/* お手伝いリスト */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-bold mb-5 flex items-center"><span className="text-xl mr-2">📋</span>とうろくされているおてつだい</h2>
          {chores.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              <p>おてつだいがとうろくされていません</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin">
              {chores.map((chore) => {
                const emoji = choreEmojiMap[chore.iconName] || '✨';
                return (
                  <div key={chore.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{emoji}</span>
                      <div>
                        <p className="font-bold text-lg">{chore.name}</p>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full inline-flex mt-1">
                          <span className="text-sm">⭐</span>
                          <span className="text-sm font-medium">{chore.points}ポイント</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteChore(chore.id)}
                      className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      けす
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* バックアップ・復元セクション */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-bold mb-5 flex items-center">
            <span className="text-xl mr-2">💾</span>データのバックアップ・ふっげん
          </h2>
          <div className="space-y-5">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                お子様の情報やお手伝い履歴をバックアップして保存することができます。
                データを復元する場合は、バックアップファイルを選択してください。
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleExportData}
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg font-medium shadow-sm transition-all"
              >
                <span className="text-xl">📥</span>
                データのバックアップ
              </button>
              
              <button
                onClick={handleImportClick}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg font-medium shadow-sm transition-all"
              >
                <span className="text-xl">📤</span>
                データの復元
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            
            {importStatus === 'success' && (
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <p className="text-green-800 font-medium">データの復元が完了しました！ ✅</p>
              </div>
            )}
            
            {importStatus === 'error' && (
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <p className="text-red-800 font-medium">データの復元に失敗しました。もう一度お試しください。</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* パスワードモーダル */}
      {showPasswordModal && (
        <PasswordModal 
          password={password}
          setPassword={setPassword}
          passwordError={passwordError}
          onCheck={handlePasswordCheck}
          onCancel={() => {
            setShowPasswordModal(false);
            setPassword('');
            setPasswordError(false);
          }}
        />
      )}
    </div>
  );
};

export default function SettingsPage() {
  return (
    <AppProvider>
      <SettingsContent />
    </AppProvider>
  );
} 