import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface AISummaryProps {
  summary: string;
  isLoading: boolean;
  onRefresh: () => void;
}

export const AISummary: React.FC<AISummaryProps> = ({ summary, isLoading, onRefresh }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">AI Summary</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      <div className="prose max-w-none">
        {isLoading ? (
          <p className="text-gray-500">Generating summary...</p>
        ) : summary ? (
          summary
        ) : (
          <p className="text-gray-500">No summary available yet.</p>
        )}
      </div>
    </div>
  );
}; 