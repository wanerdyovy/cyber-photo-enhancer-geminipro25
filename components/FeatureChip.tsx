
import React from 'react';
import { Feature } from '../types';

interface FeatureChipProps {
  feature: Feature;
  isDraggable?: boolean;
  onRemove?: (id: string) => void;
}

const FeatureChip: React.FC<FeatureChipProps> = ({ feature, isDraggable = false, onRemove }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('featureId', feature.id);
  };

  return (
    <div
      draggable={isDraggable}
      onDragStart={isDraggable ? handleDragStart : undefined}
      className={`flex items-center bg-gray-800 border border-gray-600 rounded-full px-4 py-2 text-sm font-medium text-gray-200 cursor-grab active:cursor-grabbing transition-all duration-200 hover:border-purple-500 hover:bg-gray-700 ${!isDraggable && 'cursor-default'}`}
    >
      <span>{feature.name}</span>
      {onRemove && (
        <button onClick={() => onRemove(feature.id)} className="ml-2 text-gray-500 hover:text-red-400">
          &times;
        </button>
      )}
    </div>
  );
};

export default FeatureChip;
