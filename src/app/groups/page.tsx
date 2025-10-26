'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { apiClient, Group, GroupStructure, FolderItem } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import logoImg from '@/assets/logo.svg';
import { ThemeToggle } from '@/components/theme-toggle';

interface GroupWithCount extends Group {
  cardCount: number;
}

export default function GroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<GroupWithCount[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<GroupWithCount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    const fetchGroups = async () => {
      try {
        const data = await apiClient.getGroups();
        
        // Fetch card counts for each group
        const groupsWithCounts = await Promise.all(
          data.groups.map(async (group) => {
            try {
              const structure = await apiClient.getGroupStructure(group.name);
              const count = countFiles(structure);
              return { ...group, cardCount: count };
            } catch (error) {
              console.error(`Failed to fetch count for ${group.name}:`, error);
              return { ...group, cardCount: 0 };
            }
          })
        );
        
        setGroups(groupsWithCounts);
        setFilteredGroups(groupsWithCounts);
      } catch (error) {
        console.error('Failed to fetch groups:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [isAuthenticated, router]);

  useEffect(() => {
    const filtered = groups.filter((group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredGroups(filtered);
  }, [searchQuery, groups]);

  // Count all files in a group structure
  const countFiles = (structure: GroupStructure): number => {
    let count = structure.files.length;
    
    const countFolderFiles = (folder: FolderItem): number => {
      let folderCount = folder.files.length;
      folder.folders.forEach((subfolder) => {
        folderCount += countFolderFiles(subfolder);
      });
      return folderCount;
    };
    
    structure.folders.forEach((folder) => {
      count += countFolderFiles(folder);
    });
    
    return count;
  };

  // Extract category from group name
  const getCategory = (groupName: string): string => {
    const match = groupName.match(/\[([^\]]+)\]/);
    return match ? match[1] : '';
  };

  const handleSelectGroup = (groupSlug: string) => {
    router.push(`/${groupSlug}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading groups...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Image src={logoImg} alt="Logo" width={100} height={100} />
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" className="text-destructive hover:text-destructive/80 shadow-none" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-md border">
          <div className="p-6">
            <Input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-[320px] mb-6"
            />

            <Table>
              <TableHeader>
                <TableRow className='bg-muted/50 border-none'>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className='pt-4'>
                {filteredGroups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                      No groups found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGroups.map((group) => {
                    const category = getCategory(group.name);

                    return (
                      <TableRow
                        key={group.slug}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSelectGroup(group.slug)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{group.name.split('[')[0].trim()}</span>
                            {category && (
                              <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium">
                                {category}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{group.cardCount}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

