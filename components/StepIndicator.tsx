
import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
}

const Step: React.FC<{ step: number, title: string, currentStep: number }> = ({ step, title, currentStep }) => {
  const isActive = currentStep === step;
  const isCompleted = currentStep > step;

  const getStepClasses = () => {
    if (isActive) {
      return 'bg-cyan-400 border-cyan-400 text-gray-900';
    }
    if (isCompleted) {
      return 'bg-purple-600 border-purple-600 text-white';
    }
    return 'border-gray-600 text-gray-400';
  };
  
  const getTextClasses = () => {
    if (isActive || isCompleted) {
        return 'text-white';
    }
    return 'text-gray-500';
  }

  return (
    <div className="flex items-center">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300 ${getStepClasses()}`}>
        {isCompleted ? '✓' : step}
      </div>
      <span className={`ml-3 font-orbitron font-semibold hidden sm:inline ${getTextClasses()}`}>{title}</span>
    </div>
  );
};


const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-12">
      <div className="flex items-center justify-between">
        <Step step={1} title="Upload Photo" currentStep={currentStep} />
        <div className={`flex-1 h-1 mx-4 rounded ${currentStep > 1 ? 'bg-purple-600' : 'bg-gray-700'}`}></div>
        <Step step={2} title="Select Features" currentStep={currentStep} />
        <div className={`flex-1 h-1 mx-4 rounded ${currentStep > 2 ? 'bg-purple-600' : 'bg-gray-700'}`}></div>
        <Step step={3} title="Generate" currentStep={currentStep} />
      </div>
    </div>
  );
};

export default StepIndicator;
