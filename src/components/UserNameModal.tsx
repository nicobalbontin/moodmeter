'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface UserNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  selectedMood: string;
}

export const UserNameModal = ({
  isOpen,
  onClose,
  onSubmit,
  selectedMood,
}: UserNameModalProps) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      setName('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">What&apos;s your name?</DialogTitle>
          <DialogDescription className="text-base pt-2">
            You selected: <span className="font-semibold text-gray-900 text-lg">{selectedMood}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <Input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="h-12 text-base"
          />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="px-6">
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()} className="px-6">
              Join & Share Mood
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

