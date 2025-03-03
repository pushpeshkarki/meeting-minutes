import React from 'react';

interface TranscriptViewProps {
  transcript: string;
}

export function TranscriptView({ transcript }: TranscriptViewProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="prose max-w-none">
        {transcript || 'No transcript available. Start recording to begin.'}
      </div>
    </div>
  );
} 