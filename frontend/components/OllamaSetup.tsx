'use client';

import { useEffect, useState } from 'react';
import { invoke } from '@/lib/tauri';

export function OllamaSetup() {
  const [isInstalled, setIsInstalled] = useState<boolean | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkOllamaInstallation();
  }, []);

  const checkOllamaInstallation = async () => {
    try {
      const installed = await invoke('check_ollama_installation');
      setIsInstalled(installed as boolean);
    } catch (err) {
      setError('Failed to check Ollama installation');
      console.error(err);
    }
  };

  const handleInstall = async () => {
    setIsInstalling(true);
    setError(null);
    try {
      await invoke('install_ollama');
      await invoke('start_ollama_service');
      setIsInstalled(true);
    } catch (err) {
      setError((err as Error).message);
      console.error(err);
    } finally {
      setIsInstalling(false);
    }
  };

  if (isInstalled === null) {
    return <div className="p-4">Checking Ollama installation...</div>;
  }

  if (isInstalled) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Ollama Setup Required</h2>
        <p className="mb-4">
          This app requires Ollama to run local AI models. Would you like to install it now?
        </p>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            onClick={() => window.close()}
          >
            Exit
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
            onClick={handleInstall}
            disabled={isInstalling}
          >
            {isInstalling ? 'Installing...' : 'Install Ollama'}
          </button>
        </div>
      </div>
    </div>
  );
} 