'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, GroupStructure, FileItem, FolderItem } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function GroupPage({ params }: { params: { groupSlug: string } }) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [groupStructure, setGroupStructure] = useState<GroupStructure | null>(null);
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

    const fetchGroupAndStructure = async () => {
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

        // Then fetch the structure
        const data = await apiClient.getGroupStructure(group.name);
        setGroupStructure(data);
      } catch (error) {
        console.error('Failed to fetch group structure:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupAndStructure();
  }, [params.groupSlug, isAuthenticated, authLoading, router]);

  const handleSelectFile = (filePath: string) => {
    router.push(`/${params.groupSlug}/file/${encodeURIComponent(filePath)}`);
  };

  const handleBackToGroups = () => {
    router.push('/groups');
  };

  const renderFiles = (files: FileItem[], prefix: string = '') => {
    return files.map((file) => (
      <div
        key={`${prefix}${file.path}`}
        className="py-2 px-4 hover:bg-muted/50 cursor-pointer rounded-md transition-colors"
        onClick={() => handleSelectFile(file.path)}
      >
          <span className="text-sm">{file.name}</span>
      </div>
    ));
  };

  const renderFolders = (folders: FolderItem[], level: number = 0) => {
    if (folders.length === 0) return null;

    return folders.map((folder) => (
      <AccordionItem key={folder.path} value={folder.path}>
        <AccordionTrigger className="text-sm font-medium px-4 no-underline hover:no-underline cursor-pointer">
          {folder.name}
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-1 pl-4">
            {folder.files.length > 0 && renderFiles(folder.files, `${folder.path}/`)}
            {folder.folders.length > 0 && (
              <Accordion type="single" collapsible className="w-full">
                {renderFolders(folder.folders, level + 1)}
              </Accordion>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    ));
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!groupStructure) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Failed to load group structure</div>
      </div>
    );
  }

  // Extract category from group name
  const getCategory = (name: string): string => {
    const match = name.match(/\[([^\]]+)\]/);
    return match ? match[1] : '';
  };

  const category = getCategory(groupName);
  const totalFiles = groupStructure.files.length + 
    groupStructure.folders.reduce((acc, folder) => {
      const countFiles = (f: FolderItem): number => {
        return f.files.length + f.folders.reduce((a, b) => a + countFiles(b), 0);
      };
      return acc + countFiles(folder);
    }, 0);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button className='absolute top-8 right-8 xl:left-8 xl:right-auto' variant="ghost" onClick={handleBackToGroups} >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Groups
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="tracking-tight text-xl font-bold text-foreground">{groupName.split('[')[0].trim()}</h1>
            {category && (
              <span className="inline-flex items-center rounded-lg bg-muted px-2 py-0.5 text-sm font-medium">
                {category}
              </span>
            )}
          </div>
          <p className="text-base tracking-tight text-muted-foreground font-medium">{totalFiles} files in this group</p>
        </div>

        <div className="bg-card rounded-md border">
          <div className="p-6 space-y-2">
            {/* Root level files */}
            {groupStructure.files.length > 0 && (
              <div className="space-y-1 mb-2">
                {renderFiles(groupStructure.files)}
              </div>
            )}

            {/* Folders with accordion */}
            {groupStructure.folders.length > 0 && (
              <Accordion type="single" collapsible className="w-full">
                {renderFolders(groupStructure.folders)}
              </Accordion>
            )}

            {!groupStructure || (groupStructure.files.length === 0 && groupStructure.folders.length === 0) && (
              <div className="text-center text-muted-foreground py-8">
                No files found in this group
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

