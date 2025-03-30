import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '@/context/AppContext';
import { Chore } from '@/types';
import { childEmojiMap, choreEmojiMap } from '@/utils/emojiMaps';

// 子供の選択ダイアログ用のスタイルマップ
const childStyleMap: { [key: string]: string } = {
  '#4dabf7': 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200',
  '#ff922b': 'bg-orange-100 border-orange-300 text-orange-700 hover:bg-orange-200',
  '#20c997': 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200',
  '#f06595': 'bg-pink-100 border-pink-300 text-pink-700 hover:bg-pink-200',
  '#7950f2': 'bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200',
  '#fa5252': 'bg-red-100 border-red-300 text-red-700 hover:bg-red-200',
  '#fab005': 'bg-yellow-100 border-yellow-300 text-yellow-700 hover:bg-yellow-200',
};

// 紙吹雪を作る関数
const createConfetti = (x: number, y: number) => {
  try {
    // canvas-confettiライブラリが読み込まれている場合のみ実行
    const confetti = require('canvas-confetti').default;
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: x / window.innerWidth, y: y / window.innerHeight }
    });
  } catch (error) {
    console.error('Confetti error:', error);
  }
};

// コンポーネントのタイプ定義
interface ChoreCardProps {
  chore: Chore;
}

interface ChildSelectorModalProps {
  onSelect: (childId: string, event: React.MouseEvent) => void;
  onCancel: (event: React.MouseEvent) => void;
  chore: Chore;
}

/**
 * 子供選択モーダルコンポーネント
 */
const ChildSelectorModal: React.FC<ChildSelectorModalProps> = ({ onSelect, onCancel, chore }) => {
  const { children } = useApp();
  const modalRef = useRef<HTMLDivElement>(null);

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel(e as unknown as React.MouseEvent);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  // モーダルの背景クリックでもキャンセル処理
  const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
    onCancel(e);
  }, [onCancel]);

  // モーダル本体のクリックでは背景クリックイベントを伝播させない
  const handleModalClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-[9999]"
      onClick={handleBackgroundClick}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-xl p-4 shadow-lg w-[90%] max-w-md mx-4 border border-gray-100"
        onClick={handleModalClick}
      >
        <h3 className="text-lg font-bold text-center mb-4 text-purple-700 flex items-center justify-center">
          <span className="mr-2 text-2xl">👦👧</span>
          だれがやったの？
        </h3>
        
        <div className="space-y-3">
          {children.map(child => (
            <button
              key={child.id}
              className={`w-full py-3 px-4 rounded-lg border-2 flex items-center transition-all text-base
                ${childStyleMap[child.color] || 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'}`
              }
              onClick={(e) => onSelect(child.id, e)}
            >
              <span className="text-2xl mr-3">
                {childEmojiMap[child.avatar] || '👤'}
              </span>
              <span className="font-medium">{child.name}</span>
              <span className="ml-auto text-lg">+{chore.points}</span>
            </button>
          ))}
        </div>
        
        <button
          className="w-full mt-4 py-3 px-4 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all text-base"
          onClick={onCancel}
        >
          キャンセル
        </button>
      </div>
    </div>
  );
};

/**
 * お手伝いカードコンポーネント
 */
const ChoreCard: React.FC<ChoreCardProps> = ({ chore }) => {
  const { addCompletedChore } = useApp();
  const [showChildSelector, setShowChildSelector] = useState(false);
  const [animationState, setAnimationState] = useState<'idle' | 'completed'>('idle');
  const processingRef = useRef(false);

  // お手伝いのアイコンを取得
  const choreIcon = choreEmojiMap[chore.iconName] || '✨';
  
  // 状態の簡易アクセス
  const isCompleted = animationState === 'completed';
  const isProcessing = processingRef.current;

  // カードがクリックされたときの処理
  const handleClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    // アニメーション中やすでに子供選択ダイアログが表示されている場合は処理しない
    if (animationState === 'idle' && !isProcessing && !showChildSelector) {
      setShowChildSelector(true);
    }
  }, [animationState, showChildSelector, isProcessing]);

  // 子供が選択されたときの処理
  const handleComplete = useCallback((childId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    // 処理中なら何もしない
    if (isProcessing) return;
    processingRef.current = true;
    
    // 状態の更新とアニメーションの開始
    setShowChildSelector(false);
    setAnimationState('completed');
    
    // イベントの発生位置に基づいて紙吹雪の表示位置を計算
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // 紙吹雪の表示とお手伝い完了のデータ保存
    createConfetti(x, y);
    addCompletedChore(childId, chore.id, chore.points);
    
    // 一定時間後にアニメーション状態をリセット
    const timer = setTimeout(() => {
      setAnimationState('idle');
      processingRef.current = false;
    }, 2000);

    return () => clearTimeout(timer);
  }, [addCompletedChore, chore.id, chore.points, isProcessing]);
  
  // キャンセルボタンを押したときの処理
  const handleCancel = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setShowChildSelector(false);
  }, []);

  // お手伝いカードのスタイル
  const cardStyle = {
    borderColor: isCompleted ? '#4cd964' : '#e9ecef',
    background: isCompleted ? 'linear-gradient(135deg, #e8fff0, #d7f8e8)' : 'linear-gradient(135deg, #f5f5f5, #f0f0f0)',
  };

  return (
    <>
      <div 
        className={`rounded-xl shadow-sm border-2 overflow-hidden transition-all 
          ${isCompleted ? 'complete-animation' : 'hover:shadow-md hover:scale-105'}
          ${isCompleted || isProcessing ? 'pointer-events-none' : 'cursor-pointer'}`
        }
        style={cardStyle}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center p-3">
          {/* お手伝いアイコン */}
          <div 
            className={`text-3xl mb-2 ${isCompleted ? 'bounce-custom' : 'float'}`}
          >
            {choreIcon}
          </div>
          
          {/* お手伝い名 */}
          <div className="text-center mb-1">
            <h3 className="font-bold text-gray-800">{chore.name}</h3>
          </div>
          
          {/* ポイント表示 */}
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
            <span className="text-yellow-600 mr-1">⭐</span>
            <span className="font-bold text-yellow-700">{chore.points}</span>
            <span className="text-xs text-yellow-600 ml-0.5">ポイント</span>
          </div>
          
          {/* 完了時のチェックマーク */}
          {isCompleted && (
            <div className="absolute right-2 top-2 text-xl text-green-500 bounce-custom">
              ✅
            </div>
          )}
        </div>
      </div>
      
      {/* 子供選択ダイアログ（ポータル使用） */}
      {showChildSelector && typeof document !== 'undefined' && createPortal(
        <ChildSelectorModal 
          onSelect={handleComplete}
          onCancel={handleCancel}
          chore={chore}
        />,
        document.body
      )}
    </>
  );
};

export default ChoreCard; 