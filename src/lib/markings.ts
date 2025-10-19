import { apiClient } from './api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type MarkingType = 'marked' | 'learned' | 'reviewing' | 'mastered' | 'difficult' | 'favorite';

export interface Marking {
  id?: number;
  group_name: string;
  file_path: string;
  row_number: number;
  marking_type: MarkingType;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface MarkingStats {
  group_name: string;
  file_path: string;
  marking_type: MarkingType;
  count: number;
}

/**
 * Get markings for a specific file
 */
export async function getFileMarkings(groupName: string, filePath: string): Promise<Marking[]> {
  const token = apiClient.getToken();
  const response = await fetch(
    `${API_BASE_URL}/api/markings/${encodeURIComponent(groupName)}/${encodeURIComponent(filePath)}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch markings');
  }

  const data = await response.json();
  return data.markings || [];
}

/**
 * Add or update a marking
 */
export async function saveMarking(marking: Omit<Marking, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
  const token = apiClient.getToken();
  const response = await fetch(`${API_BASE_URL}/api/markings`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      groupName: marking.group_name,
      filePath: marking.file_path,
      rowNumber: marking.row_number,
      markingType: marking.marking_type,
      notes: marking.notes,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to save marking');
  }
}

/**
 * Remove a marking
 */
export async function removeMarking(groupName: string, filePath: string, rowNumber: number): Promise<void> {
  const token = apiClient.getToken();
  const response = await fetch(`${API_BASE_URL}/api/markings`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      groupName,
      filePath,
      rowNumber,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to remove marking');
  }
}

/**
 * Get CSS class for marking type
 */
export function getMarkingClass(markingType?: MarkingType): string {
  switch (markingType) {
    case 'learned':
      return 'bg-green-100 hover:bg-green-200 dark:bg-green-500/20 dark:hover:bg-green-500/30';
    case 'reviewing':
      return 'bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-500/20 dark:hover:bg-yellow-500/30';
    case 'mastered':
      return 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-500/20 dark:hover:bg-blue-500/30';
    case 'difficult':
      return 'bg-red-100 hover:bg-red-200 dark:bg-red-500/20 dark:hover:bg-red-500/30';
    case 'favorite':
      return 'bg-purple-100 hover:bg-purple-200 dark:bg-purple-500/20 dark:hover:bg-purple-500/30';
    case 'marked':
      return 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-500/20 dark:hover:bg-gray-500/30';
    default:
      return 'hover:bg-muted/50';
  }
}

/**
 * Get next marking type in cycle
 */
export function getNextMarkingType(currentType?: MarkingType): MarkingType | undefined {
  const types: (MarkingType | undefined)[] = [undefined, 'marked', 'learned', 'reviewing', 'mastered', 'difficult', 'favorite'];
  const currentIndex = types.indexOf(currentType);
  const nextIndex = (currentIndex + 1) % types.length;
  return types[nextIndex];
}

/**
 * Get marking type label
 */
export function getMarkingLabel(markingType?: MarkingType): string {
  switch (markingType) {
    case 'learned': return '✓ Learned';
    case 'reviewing': return '↻ Reviewing';
    case 'mastered': return '★ Mastered';
    case 'difficult': return '! Difficult';
    case 'favorite': return '♥ Favorite';
    case 'marked': return '• Marked';
    default: return 'No mark';
  }
}

