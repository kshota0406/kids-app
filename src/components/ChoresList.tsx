import React from 'react';
import { useApp } from '@/context/AppContext';
import ChoreCard from '@/components/ChoreCard';
import Card from '@/components/common/Card';

/**
 * お手伝いリストを表示するコンポーネント
 */
const ChoresList: React.FC = () => {
  // AppContextからchoresを取得
  const { chores } = useApp();

  return (
    <Card 
      title={
        <div className="flex items-center py-3 px-4">
          <span className="text-2xl mr-2" style={{ color: "#ff922b" }}>⭐</span>
          <h2 className="text-xl font-bold">おてつだいメニュー</h2>
        </div>
      }
      className="mb-6"
      shadow="md"
      bodyClassName="p-4"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {chores.map((chore) => (
          <ChoreCard key={chore.id} chore={chore} />
        ))}
      </div>
    </Card>
  );
};

export default ChoresList; 