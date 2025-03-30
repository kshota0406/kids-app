/**
 * 日付を「yyyy年MM月dd日」の形式でフォーマットする
 * @param dateString ISO形式の日付文字列
 * @returns フォーマットされた日付文字列
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  return `${year}年${month}月${day}日`;
};

/**
 * 日付を「yyyy年MM月dd日 HH:mm」の形式でフォーマットする
 * @param dateString ISO形式の日付文字列
 * @returns フォーマットされた日付と時間の文字列
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${year}年${month}月${day}日 ${hours}:${minutes}`;
};

/**
 * 日付を相対時間として表示する（例：「3分前」、「1時間前」など）
 * @param dateString ISO形式の日付文字列
 * @returns 相対時間の文字列
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}秒前`;
  
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}分前`;
  
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}時間前`;
  
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay}日前`;
  
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth}ヶ月前`;
  
  const diffYear = Math.floor(diffMonth / 12);
  return `${diffYear}年前`;
};

/**
 * 曜日を取得する
 * @param dateString ISO形式の日付文字列
 * @returns 曜日の文字列（「日曜日」、「月曜日」など）
 */
export const getWeekdayString = (dateString: string): string => {
  const weekdays = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
  const date = new Date(dateString);
  return weekdays[date.getDay()];
};

/**
 * ポイントを表示用にフォーマットする
 * @param points ポイント数
 * @returns フォーマットされたポイント文字列
 */
export const formatPoints = (points: number): string => {
  return `${points}ポイント`;
};

/**
 * 時間帯を取得する
 * @param dateString ISO形式の日付文字列
 * @returns 時間帯の文字列（「朝」、「午前」など）
 */
export const getTimeOfDay = (dateString: string): string => {
  const date = new Date(dateString);
  const hour = date.getHours();
  
  if (hour >= 6 && hour < 9) return '朝(6-9時)';
  if (hour >= 9 && hour < 12) return '午前(9-12時)';
  if (hour >= 12 && hour < 15) return '午後(12-15時)';
  if (hour >= 15 && hour < 18) return '夕方(15-18時)';
  if (hour >= 18 && hour < 21) return '夜(18-21時)';
  return '深夜(21-6時)';
}; 