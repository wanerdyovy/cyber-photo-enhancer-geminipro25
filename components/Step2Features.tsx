
import React, { useState } from 'react';
import { Feature } from '../types';
import { CYBERPUNK_FEATURES } from '../constants';
import FeatureChip from './FeatureChip';
import { useTranslation } from '../i18n';
import SparklesIcon from './icons/SparklesIcon';

interface Step2FeaturesProps {
  selectedFeatures: Feature[];
  setSelectedFeatures: (features: Feature[]) => void;
  onNextStep: () => void;
}

const Step2Features: React.FC<Step2FeaturesProps> = ({ selectedFeatures, setSelectedFeatures, onNextStep }) => {
  const { t } = useTranslation();
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const addFeature = (featureToAdd: Feature) => {
    if (featureToAdd && !selectedFeatures.some(f => f.id === featureToAdd.id)) {
      setSelectedFeatures([...selectedFeatures, featureToAdd]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const featureId = e.dataTransfer.getData('featureId');
    const featureToAdd = CYBERPUNK_FEATURES.find(f => f.id === featureId);
    if (featureToAdd) {
      addFeature(featureToAdd);
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
  
  const handleFeelingLucky = () => {
    const shuffled = [...CYBERPUNK_FEATURES].sort(() => 0.5 - Math.random());
    const randomCount = Math.floor(Math.random() * 3) + 3; // Select 3 to 5 features
    setSelectedFeatures(shuffled.slice(0, randomCount));
  };

  const availableFeatures = CYBERPUNK_FEATURES.filter(
    (feature) => !selectedFeatures.some((sf) => sf.id === feature.id)
  );

  const groupedAvailableFeatures = availableFeatures.reduce((acc, feature) => {
    const category = feature.categoryKey;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(feature);
    return acc;
  }, {} as Record<string, Feature[]>);
  
  const categoryOrder = [
    'features.category.bodyMods',
    'features.category.style',
    'features.category.atmosphere'
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-orbitron text-cyan-400 mb-2">{t('step2.title')}</h2>
        <p className="text-gray-400 mb-8">{t('step2.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-orbitron text-purple-400">{t('step2.available')}</h3>
            <button
                onClick={handleFeelingLucky}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 transition-opacity"
            >
                <SparklesIcon className="w-5 h-5" />
                {t('step2.feelingLucky')}
            </button>
          </div>
          <div className="bg-gray-900/50 p-4 rounded-lg min-h-[200px] flex flex-col gap-4 content-start">
            {categoryOrder.map(categoryKey => (
              groupedAvailableFeatures[categoryKey] && groupedAvailableFeatures[categoryKey].length > 0 && (
                <div key={categoryKey}>
                  <h4 className="text-sm font-orbitron text-gray-400 mb-3 uppercase tracking-wider">{t(categoryKey)}</h4>
                  <div className="flex flex-wrap gap-3">
                    {groupedAvailableFeatures[categoryKey].map(feature => (
                      <FeatureChip key={feature.id} feature={feature} isDraggable onClick={addFeature} />
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
        <div>
            <h3 className="text-xl font-orbitron text-cyan-400 mb-4 text-center">{t('step2.selected')}</h3>
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`p-4 rounded-lg min-h-[200px] border-2 border-dashed transition-all duration-300 ${isDraggingOver ? 'border-cyan-400 bg-gray-800' : 'border-gray-600'}`}
            >
                {selectedFeatures.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">{t('step2.dropzone')}</p>
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
          {t('step2.button')}
        </button>
      </div>
    </div>
  );
};

export default Step2Features;
