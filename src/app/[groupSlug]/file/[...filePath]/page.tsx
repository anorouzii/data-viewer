'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, FileContent } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { parseCSV } from '@/lib/csv';
import { preprocessMarkdown } from '@/lib/markdown';
import { FileHeader } from '@/components/FileHeader';
import { CSVTable } from '@/components/CSVTable';
import { MarkdownContent } from '@/components/MarkdownContent';

export default function FilePage({ 
  params 
}: { 
  params: { groupSlug: string; filePath: string[] } 
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [fileContent, setFileContent] = useState<FileContent | null>(null);
  const [groupName, setGroupName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    const fetchFile = async () => {
      try {
        // First, get all groups to find the full name from slug
        const groupsData = await apiClient.getGroups();
        const group = groupsData.groups.find(g => g.slug === params.groupSlug);
        
        if (!group) {
          console.error('Group not found');
          router.push('/groups');
          return;
        }

        setGroupName(group.name);

        // Decode and join the file path
        const filePath = params.filePath.map(decodeURIComponent).join('/');
        
        const data = await apiClient.getFile(group.name, filePath);
        setFileContent(data);
      } catch (error) {
        console.error('Failed to fetch file:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFile();
  }, [params.groupSlug, params.filePath, isAuthenticated, authLoading, router]);

  const handleBack = () => {
    router.push(`/${params.groupSlug}`);
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!fileContent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Failed to load file</div>
      </div>
    );
  }

  const fileName = fileContent.name;
  const isCSV = fileName.toLowerCase().endsWith('.csv');
  const csvData = isCSV ? parseCSV(fileContent.content) : [];
  const processedMarkdown = !isCSV ? preprocessMarkdown(fileContent.content) : '';

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <FileHeader
          fileName={fileName}
          groupName={groupName}
          onBack={handleBack}
        />

        <div className="bg-card rounded-md border">
          <div className="p-8">
            {isCSV ? (
              <CSVTable 
                data={csvData} 
                groupName={groupName}
                filePath={fileName}
              />
            ) : (
              <MarkdownContent content={processedMarkdown} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
