import React, { useState, useEffect } from 'react';
import { Button, Progress, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, 
         Slider, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui';
import { AlertCircle, Download, Check, RefreshCw, Trash2, Settings2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface Model {
  name: string;
  size: string;
  status: 'available' | 'downloading' | 'not_downloaded';
  progress?: number;
  config?: ModelConfig;
}

interface ModelConfig {
  temperature: number;
  contextLength: number;
  topP: number;
}

const RECOMMENDED_MODELS = [
  { name: 'mistral', displayName: 'Mistral 7B', size: '4.1GB', description: 'Balanced performance and efficiency' },
  { name: 'llama2', displayName: 'Llama 2 7B', size: '3.8GB', description: 'Meta\'s open source LLM' },
  { name: 'neural-chat', displayName: 'Neural Chat 7B', size: '4.1GB', description: 'Optimized for conversation' },
  { name: 'codellama', displayName: 'Code Llama 7B', size: '4.0GB', description: 'Specialized for code understanding' },
  { name: 'dolphin-phi', displayName: 'Dolphin Phi-2', size: '2.7GB', description: 'Lightweight and efficient' },
  { name: 'openchat', displayName: 'OpenChat 3.5', size: '4.0GB', description: 'Strong reasoning capabilities' },
  { name: 'starling-lm', displayName: 'Starling LM', size: '4.1GB', description: 'Enhanced instruction following' },
  { name: 'nous-hermes', displayName: 'Nous Hermes', size: '4.0GB', description: 'Well-rounded performance' }
];

const DEFAULT_CONFIG: ModelConfig = {
  temperature: 0.7,
  contextLength: 4096,
  topP: 0.9
};

export const ModelManager: React.FC = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configuring, setConfiguring] = useState<string | null>(null);

  useEffect(() => {
    checkFirstTimeSetup();
    fetchModels();
  }, []);

  const checkFirstTimeSetup = async () => {
    try {
      const response = await fetch('/api/model/first-time');
      const data = await response.json();
      setIsFirstTime(data.isFirstTime);
    } catch (err) {
      setError('Failed to check first-time setup status');
    }
  };

  const fetchModels = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/model/list');
      const data = await response.json();
      
      const modelList = RECOMMENDED_MODELS.map(recommended => {
        const installed = data.models.find((m: any) => m.name === recommended.name);
        return {
          name: recommended.name,
          displayName: recommended.displayName,
          description: recommended.description,
          size: recommended.size,
          status: installed ? 'available' : 'not_downloaded',
          config: installed?.config || DEFAULT_CONFIG
        };
      });
      
      setModels(modelList);
    } catch (err) {
      setError('Failed to fetch models');
    } finally {
      setLoading(false);
    }
  };

  const downloadModel = async (modelName: string) => {
    try {
      setModels(prev => 
        prev.map(model => 
          model.name === modelName 
            ? { ...model, status: 'downloading', progress: 0 }
            : model
        )
      );

      const response = await fetch('/api/model/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: modelName }),
      });

      if (!response.ok) throw new Error('Failed to start download');

      const events = new EventSource(`/api/model/download-progress/${modelName}`);
      
      events.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.status === 'completed') {
          events.close();
          setModels(prev =>
            prev.map(model =>
              model.name === modelName
                ? { ...model, status: 'available', progress: undefined, config: DEFAULT_CONFIG }
                : model
            )
          );
        } else {
          setModels(prev =>
            prev.map(model =>
              model.name === modelName
                ? { ...model, progress: data.progress }
                : model
            )
          );
        }
      };

      events.onerror = () => {
        events.close();
        setError(`Failed to download ${modelName}`);
        setModels(prev =>
          prev.map(model =>
            model.name === modelName
              ? { ...model, status: 'not_downloaded', progress: undefined }
              : model
          )
        );
      };
    } catch (err) {
      setError(`Failed to download ${modelName}`);
    }
  };

  const deleteModel = async (modelName: string) => {
    try {
      const response = await fetch(`/api/model/delete/${modelName}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete model');

      setModels(prev =>
        prev.map(model =>
          model.name === modelName
            ? { ...model, status: 'not_downloaded', config: undefined }
            : model
        )
      );
    } catch (err) {
      setError(`Failed to delete ${modelName}`);
    }
  };

  const updateModelConfig = async (modelName: string, config: ModelConfig) => {
    try {
      const response = await fetch(`/api/model/config/${modelName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!response.ok) throw new Error('Failed to update model configuration');

      setModels(prev =>
        prev.map(model =>
          model.name === modelName
            ? { ...model, config }
            : model
        )
      );
      setConfiguring(null);
    } catch (err) {
      setError(`Failed to update configuration for ${modelName}`);
    }
  };

  return (
    <>
      <Dialog open={isFirstTime} onOpenChange={setIsFirstTime}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome to Meeting Minutes!</DialogTitle>
            <DialogDescription>
              To get started, we need to download a local AI model. This will allow you to process
              meeting transcripts privately and securely on your own computer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              We recommend starting with the Mistral model for its good balance of performance and size.
            </p>
            <Button
              onClick={() => {
                downloadModel('mistral');
                setIsFirstTime(false);
              }}
            >
              Download Mistral Model
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!configuring} onOpenChange={() => setConfiguring(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Model</DialogTitle>
            <DialogDescription>
              Adjust the model parameters to customize its behavior.
            </DialogDescription>
          </DialogHeader>
          {configuring && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Temperature</label>
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  value={[models.find(m => m.name === configuring)?.config?.temperature || 0.7]}
                  onValueChange={([value]) => {
                    const model = models.find(m => m.name === configuring);
                    if (model && model.config) {
                      updateModelConfig(configuring, { ...model.config, temperature: value });
                    }
                  }}
                />
                <p className="text-xs text-gray-500">Controls randomness in responses</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Context Length</label>
                <Select
                  value={String(models.find(m => m.name === configuring)?.config?.contextLength || 4096)}
                  onValueChange={(value) => {
                    const model = models.find(m => m.name === configuring);
                    if (model && model.config) {
                      updateModelConfig(configuring, { ...model.config, contextLength: Number(value) });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2048">2048 tokens</SelectItem>
                    <SelectItem value="4096">4096 tokens</SelectItem>
                    <SelectItem value="8192">8192 tokens</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Maximum length of text the model can process</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Top P</label>
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  value={[models.find(m => m.name === configuring)?.config?.topP || 0.9]}
                  onValueChange={([value]) => {
                    const model = models.find(m => m.name === configuring);
                    if (model && model.config) {
                      updateModelConfig(configuring, { ...model.config, topP: value });
                    }
                  }}
                />
                <p className="text-xs text-gray-500">Controls diversity of responses</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Local AI Models</h2>
          <Button variant="outline" size="sm" onClick={fetchModels}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {models.map((model) => (
            <div
              key={model.name}
              className="border rounded-lg p-4 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{model.displayName}</h3>
                  <p className="text-sm text-gray-500">{model.size}</p>
                  <p className="text-xs text-gray-400 mt-1">{model.description}</p>
                </div>
                <div className="flex gap-2">
                  {model.status === 'available' ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConfiguring(model.name)}
                      >
                        <Settings2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteModel(model.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadModel(model.name)}
                      disabled={model.status === 'downloading'}
                    >
                      {model.status === 'downloading' ? (
                        'Downloading...'
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
              
              {model.status === 'downloading' && model.progress !== undefined && (
                <Progress value={model.progress} />
              )}

              {model.status === 'available' && model.config && (
                <div className="mt-2 pt-2 border-t text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Temperature: {model.config.temperature}</span>
                    <span>Context: {model.config.contextLength}</span>
                    <span>Top P: {model.config.topP}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}; 