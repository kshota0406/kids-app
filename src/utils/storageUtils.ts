/**
 * ローカルストレージに値を保存
 * @param key ストレージのキー
 * @param value 保存する値
 */
export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    if (typeof window !== 'undefined') {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    }
  } catch (error) {
    console.error(`Error saving to localStorage (key: ${key}):`, error);
  }
};

/**
 * ローカルストレージから値を取得
 * @param key ストレージのキー
 * @param defaultValue 値が存在しない場合のデフォルト値
 * @returns 取得した値またはデフォルト値
 */
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    if (typeof window !== 'undefined') {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) {
        return defaultValue;
      }
      return JSON.parse(serializedValue) as T;
    }
  } catch (error) {
    console.error(`Error loading from localStorage (key: ${key}):`, error);
  }
  return defaultValue;
};

/**
 * ローカルストレージから項目を削除
 * @param key ストレージのキー
 */
export const removeFromStorage = (key: string): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error(`Error removing from localStorage (key: ${key}):`, error);
  }
};

/**
 * ローカルストレージの全ての項目を削除
 */
export const clearStorage = (): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * ローカルストレージに特定のキーが存在するか確認
 * @param key ストレージのキー
 * @returns キーが存在するかどうか
 */
export const hasStorageItem = (key: string): boolean => {
  try {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key) !== null;
    }
  } catch (error) {
    console.error(`Error checking localStorage item (key: ${key}):`, error);
  }
  return false;
};

/**
 * 全てのローカルストレージのキーを取得
 * @returns ストレージキーの配列
 */
export const getAllStorageKeys = (): string[] => {
  try {
    if (typeof window !== 'undefined') {
      return Object.keys(localStorage);
    }
  } catch (error) {
    console.error('Error getting all localStorage keys:', error);
  }
  return [];
}; 