
import React, { useState, useEffect } from 'react';
import { Feature } from '../types';
import DownloadIcon from './icons/DownloadIcon';
import RedoIcon from './icons/RedoIcon';
import Modal from './Modal';
import { GENERATION_LOADING_MESSAGES } from '../constants';

interface Step3GenerateProps {
  originalImageBase64: string;
  selectedFeatures: Feature[];
  onGenerate: () => Promise<string | null>;
  onBack: () => void;
}

const Step3Generate: React.FC<Step3GenerateProps> = ({ originalImageBase64, selectedFeatures, onGenerate, onBack }) => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(GENERATION_LOADING_MESSAGES[0]);

  useEffect(() => {
    let interval: number;
    if (isGenerating) {
      interval = window.setInterval(() => {
        setLoadingMessage(prev => {
          const currentIndex = GENERATION_LOADING_MESSAGES.indexOf(prev);
          const nextIndex = (currentIndex + 1) % GENERATION_LOADING_MESSAGES.length;
          return GENERATION_LOADING_MESSAGES[nextIndex];
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerateClick = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const result = await onGenerate();
      if (result) {
        setGeneratedImage(result);
      } else {
        throw new Error();
      }
    } catch (e) {
      setError("Image generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    handleGenerateClick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${generatedImage}`;
    link.download = 'cyberpunk_creation.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const originalImageUrl = `data:image/png;base64,${originalImageBase64}`;

  return (
    <div className="w-full max-w-5xl mx-auto text-center">
      <h2 className="text-3xl font-orbitron text-cyan-400 mb-2">Step 3: Generation Complete</h2>
      <p className="text-gray-400 mb-8">Your cyberpunk transformation is ready. Re-generate for a new look or download your creation.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col items-center">
            <h3 className="text-xl font-orbitron text-purple-400 mb-4">Original</h3>
            <div className="relative border-2 border-gray-600 rounded-lg p-2">
              <img src={originalImageUrl} alt="Original" className="w-full max-w-sm rounded-md object-contain" />
            </div>
            <div className="mt-4 w-full max-w-sm">
                <h4 className="text-lg font-orbitron text-gray-300">Selected Features:</h4>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {selectedFeatures.map(f => <span key={f.id} className="bg-gray-700 text-cyan-300 text-xs font-medium px-2.5 py-1 rounded-full">{f.name}</span>)}
                </div>
            </div>
        </div>

        <div className="flex flex-col items-center">
            <h3 className="text-xl font-orbitron text-cyan-400 mb-4">Cyberpunk Version</h3>
            <div className="relative w-full max-w-sm h-[400px] border-2 border-purple-500 rounded-lg p-2 shadow-lg shadow-purple-500/20 flex items-center justify-center bg-gray-900">
                {isGenerating && (
                    <div className="flex flex-col items-center text-cyan-300">
                        <svg className="animate-spin h-10 w-10 text-cyan-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="font-semibold transition-opacity duration-500">{loadingMessage}</p>
                    </div>
                )}
                {!isGenerating && generatedImage && (
                    <img src={`data:image/png;base64,${generatedImage}`} alt="Generated Cyberpunk" className="w-full h-full rounded-md object-contain animate-fade-in" />
                )}
                {!isGenerating && error && (
                    <div className="text-red-400 p-4">{error}</div>
                )}
            </div>
        </div>
      </div>
      
      {!isGenerating && (generatedImage || error) && (
        <div className="mt-12 flex flex-wrap justify-center items-center gap-4">
          <button onClick={onBack} className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-600 transition-colors">
            Change Features
          </button>
          <button onClick={handleGenerateClick} className="px-6 py-3 bg-purple-600 text-white font-bold rounded-md hover:bg-purple-500 transition-colors flex items-center gap-2">
            <RedoIcon className="w-5 h-5"/> Re-generate
          </button>
          <button
            onClick={downloadImage}
            disabled={!generatedImage}
            className="px-6 py-3 bg-cyan-500 text-gray-900 font-bold rounded-md hover:bg-cyan-400 transition-colors flex items-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            <DownloadIcon className="w-5 h-5"/> Download
          </button>
          <button onClick={() => setShowQrModal(true)} className="px-6 py-3 bg-transparent border-2 border-pink-500 text-pink-400 font-bold rounded-md hover:bg-pink-500 hover:text-white transition-colors">
            Donate & Join Chat
          </button>
        </div>
      )}

      <Modal isOpen={showQrModal} onClose={() => setShowQrModal(false)} title="Join Our Community">
        <div className="text-center text-gray-300">
            <p className="mb-4">Enjoying the results? Consider donating to support development. Donors get access to our exclusive group chat!</p>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://example.com/donate" alt="Donation QR Code" className="mx-auto rounded-lg border-2 border-cyan-400" />
            <p className="mt-4 text-sm text-gray-500">Scan the code with your camera app.</p>
        </div>
      </Modal>

    </div>
  );
};

export default Step3Generate;
