interface AudioPlayerProps {
  src: string;
  label?: string;
}

export function AudioPlayer({ src, label }: AudioPlayerProps) {
  return (
    <div className="my-4">
      <audio controls className="w-full max-w-2xl rounded-lg">
        <source src={src} />
        Your browser does not support the audio element.
      </audio>
      {label && (
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      )}
    </div>
  );
}

