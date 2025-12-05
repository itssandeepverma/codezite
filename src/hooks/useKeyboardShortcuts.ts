import { useEffect } from 'react';

interface Options {
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
}

export const useKeyboardShortcuts = ({ onTogglePlay, onStepForward, onStepBackward }: Options) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName || '')) return;
      if (e.code === 'Space') {
        e.preventDefault();
        onTogglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        onStepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        onStepBackward();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onTogglePlay, onStepForward, onStepBackward]);
};
