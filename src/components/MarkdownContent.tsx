import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { apiClient } from '@/lib/api';
import { isAudioFile } from '@/lib/markdown';
import { AudioPlayer } from './AudioPlayer';

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
            components={{
              img: ({ ...props }) => {
            let src = props.src || '';
            
            // If it's a local file reference, use the API asset endpoint
            if (typeof src === 'string' && src && !src.startsWith('http')) {
              const filename = src.split('/').pop() || src;
              
              // Check if it's an audio file
              if (isAudioFile(filename)) {
                const audioUrl = apiClient.getAssetUrl(filename);
                return <AudioPlayer src={audioUrl} label={props.alt || filename} />;
              }
              
              // It's an image
              src = apiClient.getAssetUrl(filename);
            }
            
            return (
              <img
                {...props}
                src={typeof src === 'string' ? src : ''}
                alt={props.alt || 'Image'}
                className="rounded-lg max-w-full h-auto"
                loading="lazy"
              />
            );
          },
              a: ({ ...props }) => (
            <a
              {...props}
              className="text-primary hover:underline"
              target={props.href?.startsWith('http') ? '_blank' : undefined}
              rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            />
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <code className={className} {...props}>
                {children}
              </code>
            ) : (
              <code
                className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children, ...props }) => (
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto" {...props}>
              {children}
            </pre>
          ),
              table: ({ ...props }) => (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border" {...props} />
            </div>
          ),
              th: ({ ...props }) => (
            <th className="px-4 py-2 bg-muted font-semibold text-left" {...props} />
          ),
              td: ({ ...props }) => (
            <td className="px-4 py-2 border-t border-border" {...props} />
          ),
              mark: ({ ...props }) => (
            <mark className="bg-yellow-200 dark:bg-yellow-500/30 px-1 rounded" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

