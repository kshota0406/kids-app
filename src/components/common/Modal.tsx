'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string | React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  className?: string;
  backdropClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

/**
 * 汎用モーダルコンポーネント
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'md',
  closeOnClickOutside = true,
  closeOnEsc = true,
  showCloseButton = true,
  className = '',
  backdropClassName = '',
  contentClassName = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // 最大幅のスタイル
  const maxWidthStyles: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full', string> = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
  };

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, closeOnEsc]);

  // モーダル外側をクリックした時の処理
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (!closeOnClickOutside) return;
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // モーダルが表示されていない場合は何もレンダリングしない
  if (!isOpen) return null;

  // ポータルを使用してbody直下にモーダルをレンダリング
  return createPortal(
    <div 
      className={`fixed inset-0 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30 z-50 ${backdropClassName}`}
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className={`bg-white rounded-xl shadow-xl ${maxWidthStyles[maxWidth]} w-full ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className={`p-4 flex items-center justify-between border-b border-gray-100 ${headerClassName}`}>
            {typeof title === 'string' ? (
              <h2 className="text-xl font-bold">{title}</h2>
            ) : (
              title
            )}
            {showCloseButton && (
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="閉じる"
              >
                ✕
              </button>
            )}
          </div>
        )}

        <div className={`p-4 ${contentClassName}`}>
          <div className={`${bodyClassName}`}>{children}</div>

          {footer && (
            <div className={`mt-4 pt-4 flex justify-end gap-3 ${footerClassName}`}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

/**
 * 確認ダイアログ用のコンポーネント
 */
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger' | 'success';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = '確認',
  message,
  confirmText = 'はい',
  cancelText = 'いいえ',
  confirmVariant = 'primary',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const footer = (
    <>
      <Button 
        variant="secondary" 
        onClick={onClose}
      >
        {cancelText}
      </Button>
      <Button 
        variant={confirmVariant} 
        onClick={handleConfirm}
      >
        {confirmText}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
    >
      {typeof message === 'string' ? (
        <p>{message}</p>
      ) : (
        message
      )}
    </Modal>
  );
};

export default Modal; 