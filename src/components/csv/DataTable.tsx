import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getMarkingClass, getMarkingLabel, getNextMarkingType, type MarkingType } from '@/lib/markings';

interface DataTableProps {
  headers: string[];
  rows: string[][];
  startIndex: number;
  markings: Map<number, MarkingType>;
  onRowClick: (rowIndex: number) => void;
}

export function DataTable({ headers, rows, startIndex, markings, onRowClick }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 border-none">
            {headers.map((header, index) => (
              <TableHead key={index}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => {
            const actualRowIndex = startIndex + rowIndex;
            const markingType = markings.get(actualRowIndex);
            const rowClass = getMarkingClass(markingType);
            
            return (
              <TableRow
                key={actualRowIndex}
                className={`cursor-pointer ${rowClass}`}
                onClick={() => onRowClick(actualRowIndex)}
                title={`Click to mark as ${getMarkingLabel(getNextMarkingType(markingType))}`}
              >
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

