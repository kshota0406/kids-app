'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string | React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  onClick?: () => void;
  hoverable?: boolean;
  bordered?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * 汎用カードコンポーネント
 */
const Card: React.FC<CardProps> = ({
  children,
  title,
  icon,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  onClick,
  hoverable = false,
  bordered = true,
  shadow = 'sm',
}) => {
  // 影のスタイル
  const shadowStyles: Record<'none' | 'sm' | 'md' | 'lg', string> = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  // ボーダーのスタイル
  const borderStyle = bordered ? 'border border-gray-100' : '';
  
  // ホバー効果
  const hoverStyle = hoverable 
    ? 'hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer' 
    : '';

  // カードのクラス名を構築
  const cardClasses = `
    bg-white 
    rounded-xl 
    overflow-hidden
    ${shadowStyles[shadow]}
    ${borderStyle}
    ${hoverStyle}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // ヘッダーのクラス名
  const headerClasses = `
    font-bold 
    flex 
    items-center
    ${headerClassName}
  `.trim().replace(/\s+/g, ' ');

  // ボディのクラス名
  const bodyClasses = `
    ${bodyClassName}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={cardClasses} onClick={onClick}>
      {title && (
        <div className={headerClasses}>
          {icon && <span className="mr-2">{icon}</span>}
          {typeof title === 'string' ? (
            <h2 className="text-xl">{title}</h2>
          ) : (
            title
          )}
        </div>
      )}
      <div className={bodyClasses}>{children}</div>
    </div>
  );
};

export default Card; 