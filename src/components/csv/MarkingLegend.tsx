import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Info } from 'lucide-react';

export function MarkingLegend() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="shadow-none">
          <Info className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Marking Legend</h4>
          <p className="text-sm text-muted-foreground">
            Click on any row to cycle through marking types:
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded bg-gray-400"></div>
              <span>Marked</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded bg-green-400"></div>
              <span>Learned</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded bg-yellow-400"></div>
              <span>Reviewing</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded bg-blue-400"></div>
              <span>Mastered</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded bg-red-400"></div>
              <span>Difficult</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded bg-purple-400"></div>
              <span>Favorite</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

