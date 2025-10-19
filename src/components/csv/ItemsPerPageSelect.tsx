import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Check } from 'lucide-react';

interface ItemsPerPageSelectProps {
  value: number;
  onChange: (value: number) => void;
}

const OPTIONS = [10, 25, 50, 100];

export function ItemsPerPageSelect({ value, onChange }: ItemsPerPageSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        Rows per page:
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="shadow-none h-8 w-16">
            {value}
            <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-20">
          {OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => onChange(option)}
              className="justify-between"
            >
              {option}
              {value === option && (
                <Check className="h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

