import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Pause } from 'lucide-react';

interface RecordingControlsProps {
  isRecording: boolean;
  onRecordingStart: () => void;
  onRecordingStop: () => void;
  onTranscriptReceived: (transcript: any) => void;
  barHeights: string[];
}

export function RecordingControls({
  isRecording,
  onRecordingStart,
  onRecordingStop,
  onTranscriptReceived,
  barHeights,
}: RecordingControlsProps) {
  return (
    <div className="flex items-center space-x-4">
      {isRecording ? (
        <Button
          variant="destructive"
          size="lg"
          onClick={onRecordingStop}
          className="rounded-full w-16 h-16 flex items-center justify-center"
        >
          <Square className="w-6 h-6" />
        </Button>
      ) : (
        <Button
          variant="default"
          size="lg"
          onClick={onRecordingStart}
          className="rounded-full w-16 h-16 flex items-center justify-center bg-red-500 hover:bg-red-600"
        >
          <Mic className="w-6 h-6" />
        </Button>
      )}
      {isRecording && (
        <div className="flex items-end space-x-1">
          {barHeights.map((height, index) => (
            <div
              key={index}
              className="w-1 bg-red-500 rounded-t transition-all duration-300"
              style={{ height }}
            />
          ))}
        </div>
      )}
    </div>
  );
} 