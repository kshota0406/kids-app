'use client';

import React, { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import Link from 'next/link';
import { Child } from '@/types';

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
  'award': '🏆',
  'gift': '🎁',
};

// お手伝い絵文字マッピング
const choreEmojiMap: {[key: string]: string} = {
  'trash': '🗑️',
  'book': '📚',
  'broom': '🧹',
  'dish': '🍽️',
  'laundry': '👕',
  'plant': '🌱',
  'bed': '🛏️',
  'pet': '🐶',
  'toy': '🧸',
  'clean': '🧼',
  'mail': '📬',
  'shop': '🛒',
  'star': '⭐',
  'check': '✅',
  'shirt': '👕',
  'box': '📦',
};

// 設定ページのコンテンツ
const SettingsContent = () => {
  const { 
    children, 
    selectedChildId, 
    setSelectedChildId,
    updateChildName, 
    updateChildAvatar,
    updateChildColor,
    addChild,
    deleteChild,
    chores, 
    addChore,
    deleteChore,
    resetAllPoints,
    exportData,
    importData
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
  
  // 新しい子ども用の状態
  const [newChildName, setNewChildName] = useState('');
  
  // 子どもの編集用の状態
  const [editingChildName, setEditingChildName] = useState('');
  const [editingChildAvatar, setEditingChildAvatar] = useState('');
  const [editingChildColor, setEditingChildColor] = useState('');
  const [isEditingChild, setIsEditingChild] = useState(false);

  // ファイル入力の参照
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
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
    if (editingChildName.trim()) {
      updateChildName(selectedChildId, editingChildName);
      updateChildAvatar(selectedChildId, editingChildAvatar);
      updateChildColor(selectedChildId, editingChildColor);
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

  // 子どもの追加処理
  const handleAddChild = () => {
    handleProtectedAction(() => {
      if (newChildName.trim()) {
        addChild(newChildName);
        setNewChildName('');
        alert('あたらしいこどもをついかしました！');
      }
    });
  };

  // 子どもの削除処理
  const handleDeleteChild = (childId: string) => {
    handleProtectedAction(() => {
      if (window.confirm('このこどもをけしますか？')) {
        deleteChild(childId);
        alert('こどもをけしました！');
      }
    });
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

  // 全てのポイントをリセット
  const handleResetAllPoints = () => {
    handleProtectedAction(() => {
      if (window.confirm('すべてのこどものポイントをリセットしますか？')) {
        resetAllPoints();
        alert('すべてのポイントをリセットしました！');
      }
    });
  };

  // ファイルからデータをインポート
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importData(content);
        if (success) {
          alert('データをインポートしました！');
        }
      }
    };
    reader.readAsText(file);
    
    // ファイル選択をリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const iconOptions = [
    { value: 'bed', label: 'ベッド', emoji: '🛏️' },
    { value: 'dish', label: 'おさら', emoji: '🍽️' },
    { value: 'broom', label: 'ほうき', emoji: '🧹' },
    { value: 'trash', label: 'ごみ', emoji: '🗑️' },
    { value: 'shirt', label: 'ふく', emoji: '👕' },
    { value: 'box', label: 'はこ', emoji: '📦' },
    { value: 'star', label: 'ほし', emoji: '⭐' },
  ];

  const avatarOptions = [
    { value: 'smile', label: 'えがお', emoji: '😊' },
    { value: 'heart', label: 'ハート', emoji: '❤️' },
    { value: 'user', label: 'ひと', emoji: '👤' },
    { value: 'award', label: 'メダル', emoji: '🏆' },
    { value: 'gift', label: 'プレゼント', emoji: '🎁' },
  ];

  const colorOptions = [
    { value: '#4dabf7', label: 'あお' },
    { value: '#ff922b', label: 'オレンジ' },
    { value: '#51cf66', label: 'みどり' },
    { value: '#ffd43b', label: 'きいろ' },
    { value: '#ff6b6b', label: 'あか' },
    { value: '#cc5de8', label: 'むらさき' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-2 py-6">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <span className="text-2xl mr-2">⚙️</span>
          <h1 className="text-2xl font-bold text-blue-600">せっていページ</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/" className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full">
            もどる
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* 子どもの管理 */}
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">こどものかんり</h2>
            
            {/* 子どもリスト */}
            <div className="space-y-3 mb-6">
              {children.map((child) => {
                const emoji = childEmojiMap[child.avatar] || '👤';
                return (
                  <div 
                    key={child.id} 
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: `${child.color}15` }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl" style={{ color: child.color }}>{emoji}</span>
                      <div>
                        <p className="font-bold">{child.name}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-sm">⭐</span>
                          <span className="text-sm">{child.totalPoints}ポイント</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditingChild(child)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        へんしゅう
                      </button>
                      <button
                        onClick={() => handleDeleteChild(child.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        けす
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* 子ども追加フォーム */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
                className="flex-1 p-2 border rounded-lg"
                placeholder="あたらしいこどものなまえ"
              />
              <button
                onClick={handleAddChild}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                ついか
              </button>
            </div>
          </div>

          {/* 子ども編集フォーム */}
          {isEditingChild && selectedChild && (
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">こどもをへんしゅう</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-bold">なまえ</label>
                  <input
                    type="text"
                    value={editingChildName}
                    onChange={(e) => setEditingChildName(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="こどものなまえ"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 font-bold">アイコン</label>
                  <div className="grid grid-cols-5 gap-2">
                    {avatarOptions.map((avatar) => (
                      <div
                        key={avatar.value}
                        onClick={() => setEditingChildAvatar(avatar.value)}
                        className={`flex flex-col items-center p-2 border rounded-lg cursor-pointer ${
                          editingChildAvatar === avatar.value ? 'bg-blue-100 border-blue-500' : ''
                        }`}
                      >
                        <span className="text-2xl">{avatar.emoji}</span>
                        <span className="text-xs mt-1">{avatar.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1 font-bold">カラー</label>
                  <div className="grid grid-cols-6 gap-2">
                    {colorOptions.map((color) => (
                      <div
                        key={color.value}
                        onClick={() => setEditingChildColor(color.value)}
                        className={`flex flex-col items-center p-2 border rounded-lg cursor-pointer ${
                          editingChildColor === color.value ? 'border-2' : ''
                        }`}
                        style={{ borderColor: editingChildColor === color.value ? color.value : 'transparent' }}
                      >
                        <div 
                          className="w-6 h-6 rounded-full mb-1" 
                          style={{ backgroundColor: color.value }}
                        ></div>
                        <span className="text-xs">{color.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setIsEditingChild(false)}
                    className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={saveChildEdit}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    ほぞん
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {/* お手伝い追加フォーム */}
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">あたらしいおてつだい</h2>
            <form onSubmit={handleAddChore} className="space-y-4">
              <div>
                <label className="block mb-1 font-bold">なまえ</label>
                <input
                  type="text"
                  value={newChoreName}
                  onChange={(e) => setNewChoreName(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="おてつだいのなまえ"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-bold">ポイント</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={newChorePoints}
                  onChange={(e) => setNewChorePoints(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-bold">アイコン</label>
                <div className="grid grid-cols-4 gap-2">
                  {iconOptions.map((icon) => (
                    <div
                      key={icon.value}
                      onClick={() => setNewChoreIcon(icon.value)}
                      className={`flex flex-col items-center p-2 border rounded-lg cursor-pointer ${
                        newChoreIcon === icon.value ? 'bg-blue-100 border-blue-500' : ''
                      }`}
                    >
                      <span className="text-2xl">{icon.emoji}</span>
                      <span className="text-sm mt-1">{icon.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                ついか
              </button>
            </form>
          </div>

          {/* お手伝いリスト */}
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">とうろくされているおてつだい</h2>
            {chores.length === 0 ? (
              <p className="text-center py-4 text-gray-500">おてつだいがとうろくされていません</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {chores.map((chore) => {
                  const emoji = choreEmojiMap[chore.iconName] || '✨';
                  return (
                    <div key={chore.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{emoji}</span>
                        <div>
                          <p className="font-bold">{chore.name}</p>
                          <div className="flex items-center gap-1">
                            <span className="text-sm">⭐</span>
                            <span className="text-sm">{chore.points}ポイント</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteChore(chore.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        けす
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* データバックアップと復元セクション */}
      <div className="mt-8 card p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <span className="text-2xl mr-2">💾</span>
          データのバックアップと復元
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold mb-2">データのバックアップ</h3>
            <p className="text-sm text-gray-600 mb-3">
              現在のデータをファイルに保存します。
            </p>
            <button
              onClick={exportData}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <span className="text-xl">💾</span>
              データを保存する
            </button>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">データの復元</h3>
            <p className="text-sm text-gray-600 mb-3">
              保存したファイルからデータを読み込みます。
            </p>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleFileImport}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <span className="text-xl">📂</span>
              ファイルから読み込む
            </button>
          </div>
        </div>
      </div>
      
      {/* 危険な操作セクション */}
      <div className="mt-6 card p-6 border-red-200">
        <h2 className="text-xl font-bold mb-4 flex items-center text-red-600">
          <span className="text-2xl mr-2">⚠️</span>
          きけんな操作
        </h2>
        
        <div>
          <p className="text-sm text-gray-600 mb-3">
            すべてのこどものポイントをリセットします。この操作は取り消せません。
          </p>
          <button
            onClick={handleResetAllPoints}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <span className="text-xl">🗑️</span>
            すべてのポイントをリセット
          </button>
        </div>
      </div>

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