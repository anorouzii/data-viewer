import { type MarkingType } from './markings';

/**
 * Filter rows based on search query and marking type
 */
export function filterCSVRows(
  rows: string[][],
  searchQuery: string,
  filterType: MarkingType | 'all',
  markings: Map<number, MarkingType>
): string[][] {
  let filteredRows = rows;
  
  // Filter by search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredRows = filteredRows.filter(row =>
      row.some(cell => cell.toLowerCase().includes(query))
    );
  }
  
  // Filter by marking type
  if (filterType !== 'all') {
    filteredRows = filteredRows.filter((_, index) => {
      const markingType = markings.get(index);
      return markingType === filterType;
    });
  }
  
  return filteredRows;
}

/**
 * Paginate rows
 */
export function paginateRows<T>(rows: T[], page: number, itemsPerPage: number): T[] {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return rows.slice(startIndex, endIndex);
}

/**
 * Calculate pagination info
 */
export function getPaginationInfo(totalItems: number, currentPage: number, itemsPerPage: number) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return { totalPages, startIndex, endIndex };
}

