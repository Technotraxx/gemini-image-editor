import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CommandButtonsProps {
  commands: string[];
  onCommandSelect: (command: string) => void;
  onClose?: () => void;
  loading?: boolean;
}

export function CommandButtons({ commands, onCommandSelect, onClose, loading = false }: CommandButtonsProps) {
  if (!commands || !commands.length) return null;

  return (
    <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-blue-700 font-medium">Quick Edit Commands:</p>
        {onClose && (
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="space-y-2">
        {commands.map((command, index) => (
          <Button
            key={index}
            variant="outline"
            className={`w-full text-left justify-start h-auto py-3 px-4 bg-white hover:bg-blue-100 border-blue-200 text-blue-800 whitespace-normal ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => !loading && onCommandSelect(command)}
            disabled={loading}
          >
            <span className="text-sm leading-relaxed">
              {index + 1}. {command}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}