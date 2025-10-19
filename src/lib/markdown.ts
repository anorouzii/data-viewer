/**
 * Convert Obsidian-style links to standard markdown
 * ![[file]] becomes ![file](file)
 * ==highlight== becomes <mark>highlight</mark>
 */
export function preprocessMarkdown(content: string): string {
  let processed = content;
  
  // Convert Obsidian image/file links
  processed = processed.replace(/!\[\[([^\]]+)\]\]/g, (match, filename) => {
    const encodedFilename = encodeURIComponent(filename);
    return `![${filename}](${encodedFilename})`;
  });
  
  // Convert ==highlight== to <mark>highlight</mark>
  processed = processed.replace(/==([^=]+)==/g, '<mark>$1</mark>');
  
  return processed;
}

/**
 * Check if a filename is an audio file
 */
export function isAudioFile(filename: string): boolean {
  const extension = filename.split('.').pop()?.toLowerCase();
  const audioExtensions = ['mp3', 'm4a', 'wav', 'ogg', 'aac', 'flac', 'webm'];
  return extension ? audioExtensions.includes(extension) : false;
}

