
import React, { useState } from 'react';
import { Feature } from '../types';
import { CYBERPUNK_FEATURES } from '../constants';
import FeatureChip from './FeatureChip';

interface Step2FeaturesProps {
  selectedFeatures: Feature[];
  setSelectedFeatures: (features: Feature[]) => void;
  onNextStep: () => void;
}

const Step2Features: React.FC<Step2FeaturesProps> = ({ selectedFeatures, setSelectedFeatures, onNextStep }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const featureId = e.dataTransfer.getData('featureId');
    const featureToAdd = CYBERPUNK_FEATURES.find(f => f.id === featureId);
    if (featureToAdd && !selectedFeatures.some(f => f.id === featureId)) {
      setSelectedFeatures([...selectedFeatures, featureToAdd]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const removeFeature = (id: string) => {
    setSelectedFeatures(selectedFeatures.filter(f => f.id !== id));
  };

  const availableFeatures = CYBERPUNK_FEATURES.filter(
    (feature) => !selectedFeatures.some((sf) => sf.id === feature.id)
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-orbitron text-cyan-400 mb-2">Step 2: Add Cybernetic Enhancements</h2>
        <p className="text-gray-400 mb-8">Drag & drop features you want to add to your photo.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-orbitron text-purple-400 mb-4 text-center">Available Features</h3>
          <div className="bg-gray-900/50 p-4 rounded-lg min-h-[200px] flex flex-wrap gap-3 justify-center content-start">
            {availableFeatures.map(feature => (
              <FeatureChip key={feature.id} feature={feature} isDraggable />
            ))}
          </div>
        </div>
        <div>
            <h3 className="text-xl font-orbitron text-cyan-400 mb-4 text-center">Your Chosen Enhancements</h3>
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`p-4 rounded-lg min-h-[200px] border-2 border-dashed transition-all duration-300 ${isDraggingOver ? 'border-cyan-400 bg-gray-800' : 'border-gray-600'}`}
            >
                {selectedFeatures.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Drop features here</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-3 justify-center">
                        {selectedFeatures.map(feature => (
                        <FeatureChip key={feature.id} feature={feature} onRemove={removeFeature} />
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <button
          onClick={onNextStep}
          disabled={selectedFeatures.length === 0}
          className="px-8 py-4 bg-cyan-500 text-gray-900 font-bold rounded-md hover:bg-cyan-400 transition-all duration-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed text-lg"
        >
          Proceed to Generation
        </button>
      </div>
    </div>
  );
};

export default Step2Features;
