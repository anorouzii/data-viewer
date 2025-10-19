import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface FileHeaderProps {
  fileName: string;
  groupName: string;
  onBack: () => void;
}

export function FileHeader({ fileName, groupName, onBack }: FileHeaderProps) {
  return (
    <div className="mb-8">
      <Button className="absolute top-8 left-8" variant="ghost" onClick={onBack}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Files
      </Button>
      <h1 className="tracking-tight text-xl font-bold text-foreground">
        {fileName.replace('.md', '').replace('.csv', '')}
      </h1>
      <p className="text-base tracking-tight text-muted-foreground font-medium mt-2">
        {groupName}
      </p>
    </div>
  );
}

