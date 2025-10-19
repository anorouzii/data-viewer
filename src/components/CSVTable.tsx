'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  getFileMarkings,
  saveMarking,
  removeMarking,
  getNextMarkingType,
  type MarkingType,
} from '@/lib/markings';
import { filterCSVRows, getPaginationInfo } from '@/lib/csvFilters';
import { SearchBar } from './csv/SearchBar';
import { FilterDropdown } from './csv/FilterDropdown';
import { MarkingLegend } from './csv/MarkingLegend';
import { DataTable } from './csv/DataTable';
import { Pagination } from './csv/Pagination';
import { ItemsPerPageSelect } from './csv/ItemsPerPageSelect';

interface CSVTableProps {
  data: string[][];
  groupName: string;
  filePath: string;
}

export function CSVTable({ data, groupName, filePath }: CSVTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [markings, setMarkings] = useState<Map<number, MarkingType>>(new Map());
  const [isLoadingMarkings, setIsLoadingMarkings] = useState(true);
  const [filterType, setFilterType] = useState<MarkingType | 'all'>('all');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Load markings from backend on mount
  useEffect(() => {
    const loadMarkings = async () => {
      try {
        const fetchedMarkings = await getFileMarkings(groupName, filePath);
        const markingsMap = new Map<number, MarkingType>();
        fetchedMarkings.forEach(m => {
          markingsMap.set(m.row_number, m.marking_type);
        });
        setMarkings(markingsMap);
      } catch (error) {
        console.error('Failed to load markings:', error);
      } finally {
        setIsLoadingMarkings(false);
      }
    };

    loadMarkings();
  }, [groupName, filePath]);

  if (data.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No data to display
      </div>
    );
  }

  const headers = data[0];
  const allRows = data.slice(1);
  
  // Filter rows based on search query and marking type
  const filteredRows = useMemo(() => {
    return filterCSVRows(allRows, searchQuery, filterType, markings);
  }, [allRows, searchQuery, filterType, markings]);
  
  const { totalPages, startIndex, endIndex } = getPaginationInfo(
    filteredRows.length,
    currentPage,
    itemsPerPage
  );
  
  const currentRows = filteredRows.slice(startIndex, endIndex);

  // Reset to page 1 when search or filter changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (type: MarkingType | 'all') => {
    setFilterType(type);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleRowClick = async (rowIndex: number) => {
    const currentMarkingType = markings.get(rowIndex);
    const nextMarkingType = getNextMarkingType(currentMarkingType);
    
    try {
      if (nextMarkingType) {
        await saveMarking({
          group_name: groupName,
          file_path: filePath,
          row_number: rowIndex,
          marking_type: nextMarkingType,
        });
        
        const newMarkings = new Map(markings);
        newMarkings.set(rowIndex, nextMarkingType);
        setMarkings(newMarkings);
      } else {
        await removeMarking(groupName, filePath, rowIndex);
        
        const newMarkings = new Map(markings);
        newMarkings.delete(rowIndex);
        setMarkings(newMarkings);
      }
    } catch (error) {
      console.error('Failed to update marking:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="flex items-center justify-between gap-2 mb-6">
        <SearchBar value={searchQuery} onChange={handleSearchChange} />
        
        <div className="flex items-center gap-2">
          <FilterDropdown filterType={filterType} onFilterChange={handleFilterChange} />
          <MarkingLegend />
        </div>
      </div>

      {/* Table */}
      <DataTable
        headers={headers}
        rows={currentRows}
        startIndex={startIndex}
        markings={markings}
        onRowClick={handleRowClick}
      />

      {/* No Results Message */}
      {filteredRows.length === 0 && searchQuery && (
        <div className="text-center text-muted-foreground py-8">
          No results found for &quot;{searchQuery}&quot;
        </div>
      )}

      {/* Items Per Page and Pagination */}
      {filteredRows.length > 0 && (
        <div className="flex items-center justify-between gap-4">
          <ItemsPerPageSelect
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          />
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={filteredRows.length}
            onPageChange={setCurrentPage}
            showFilterInfo={searchQuery !== '' || filterType !== 'all'}
            totalBeforeFilter={allRows.length}
          />
        </div>
      )}
    </div>
  );
}
