import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter, Check } from 'lucide-react';
import { type MarkingType } from '@/lib/markings';

interface FilterDropdownProps {
  filterType: MarkingType | 'all';
  onFilterChange: (type: MarkingType | 'all') => void;
}

export function FilterDropdown({ filterType, onFilterChange }: FilterDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="shadow-none">
          <Filter className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Filter by marking</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onFilterChange('all')}>
          <Check className={`mr-2 h-4 w-4 ${filterType === 'all' ? 'opacity-100' : 'opacity-0'}`} />
          All Rows
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onFilterChange('marked')}>
          <Check className={`mr-2 h-4 w-4 ${filterType === 'marked' ? 'opacity-100' : 'opacity-0'}`} />
          <div className="w-3 h-3 rounded bg-gray-400 mr-2"></div>
          Marked
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFilterChange('learned')}>
          <Check className={`mr-2 h-4 w-4 ${filterType === 'learned' ? 'opacity-100' : 'opacity-0'}`} />
          <div className="w-3 h-3 rounded bg-green-400 mr-2"></div>
          Learned
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFilterChange('reviewing')}>
          <Check className={`mr-2 h-4 w-4 ${filterType === 'reviewing' ? 'opacity-100' : 'opacity-0'}`} />
          <div className="w-3 h-3 rounded bg-yellow-400 mr-2"></div>
          Reviewing
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFilterChange('mastered')}>
          <Check className={`mr-2 h-4 w-4 ${filterType === 'mastered' ? 'opacity-100' : 'opacity-0'}`} />
          <div className="w-3 h-3 rounded bg-blue-400 mr-2"></div>
          Mastered
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFilterChange('difficult')}>
          <Check className={`mr-2 h-4 w-4 ${filterType === 'difficult' ? 'opacity-100' : 'opacity-0'}`} />
          <div className="w-3 h-3 rounded bg-red-400 mr-2"></div>
          Difficult
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFilterChange('favorite')}>
          <Check className={`mr-2 h-4 w-4 ${filterType === 'favorite' ? 'opacity-100' : 'opacity-0'}`} />
          <div className="w-3 h-3 rounded bg-purple-400 mr-2"></div>
          Favorite
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

