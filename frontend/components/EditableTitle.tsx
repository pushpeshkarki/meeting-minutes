import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

interface EditableTitleProps {
  initialTitle: string;
  onTitleChange: (newTitle: string) => void;
}

export function EditableTitle({ initialTitle, onTitleChange }: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    onTitleChange(title);
  };

  return (
    <div className="relative">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex items-center">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="pr-8"
            autoFocus
            onBlur={handleSubmit}
          />
        </form>
      ) : (
        <h1
          className="text-2xl font-bold cursor-pointer hover:text-gray-700"
          onClick={() => setIsEditing(true)}
        >
          {title}
        </h1>
      )}
    </div>
  );
} 