import React, { useState } from 'react';
import StepIndicator from './components/StepIndicator';
import Step1Upload from './components/Step1Upload';
import Step2Features from './components/Step2Features';
import Step3Generate from './components/Step3Generate';
import { verifyIsPersonalPhoto, generateCyberpunkImage } from './services/geminiService';
import { Feature } from './types';
import { useTranslation } from './i18n';
import LanguageSelector from './components/LanguageSelector';

function App() {
  const [step, setStep] = useState(1);
  const [originalImage, setOriginalImage] = useState<{ file: File; base64: string } | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([]);
  const { t } = useTranslation();

  const handleImageVerified = (file: File, base64: string) => {
    setOriginalImage({ file, base64 });
    setStep(2);
  };

  const handleFeaturesSelected = () => {
    if (selectedFeatures.length > 0) {
      setStep(3);
    }
  };
  
  const handleGenerate = () => {
    if (!originalImage) return Promise.resolve(null);
    // FIX: Translate feature names before passing them to the service to match the updated function signature.
    const featureNames = selectedFeatures.map(f => t(f.nameKey));
    return generateCyberpunkImage(originalImage.base64, featureNames);
  }

  const handleBackToFeatures = () => {
    setStep(2);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <Step1Upload onImageVerified={handleImageVerified} verifyIsPersonalPhoto={verifyIsPersonalPhoto} />;
      case 2:
        return <Step2Features selectedFeatures={selectedFeatures} setSelectedFeatures={setSelectedFeatures} onNextStep={handleFeaturesSelected} />;
      case 3:
        if (!originalImage) {
          // Should not happen in normal flow, but good to handle
          setStep(1); 
          return null;
        }
        return <Step3Generate originalImageBase64={originalImage.base64} selectedFeatures={selectedFeatures} onGenerate={handleGenerate} onBack={handleBackToFeatures} />;
      default:
        return <div>Invalid Step</div>;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
       <div 
        className="absolute inset-0 bg-cover bg-center opacity-10" 
        style={{backgroundImage: "url('https://picsum.photos/seed/cyberpunkbg/1920/1080')"}}
      ></div>
      <div 
        className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/80 to-gray-900"
      ></div>
      <div className="relative container mx-auto px-4 py-8 md:py-16 flex flex-col items-center">
        <header className="w-full text-center mb-12">
          <div className="absolute top-4 right-4 md:top-8 md:right-8">
            <LanguageSelector />
          </div>
          <h1 className="text-4xl md:text-6xl font-orbitron font-extrabold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              {t('header.title_part1')}
            </span> {t('header.title_part2')}
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            {t('header.subtitle')}
          </p>
        </header>
        
        <main className="w-full">
          <StepIndicator currentStep={step} />
          <div className="mt-12 bg-black bg-opacity-30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 md:p-10 shadow-2xl">
            {renderStepContent()}
          </div>
        </main>

        <footer className="text-center mt-16 text-gray-600 text-sm">
          <p>{t('footer.poweredBy')}</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
