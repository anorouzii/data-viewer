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
        <DropdownMenuItem onClick={() => onFilterChange('meaning')}>
          <Check className={`mr-2 h-4 w-4 ${filterType === 'meaning' ? 'opacity-100' : 'opacity-0'}`} />
          <div className="w-3 h-3 rounded bg-blue-400 mr-2"></div>
          Meaning
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFilterChange('spelling')}>
          <Check className={`mr-2 h-4 w-4 ${filterType === 'spelling' ? 'opacity-100' : 'opacity-0'}`} />
          <div className="w-3 h-3 rounded bg-green-400 mr-2"></div>
          Spelling
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFilterChange('both')}>
          <Check className={`mr-2 h-4 w-4 ${filterType === 'both' ? 'opacity-100' : 'opacity-0'}`} />
          <div className="w-3 h-3 rounded bg-purple-400 mr-2"></div>
          Both
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

