interface FlagProps {
  country: 'br' | 'us';
  className?: string;
}

export function Flag({ country, className = 'h-3.5 w-5' }: FlagProps) {
  if (country === 'br') {
    return (
      <svg viewBox="0 0 28 20" className={className} aria-hidden role="img">
        <rect width="28" height="20" rx="2" fill="#009b3a" />
        <path d="M14 3 L25 10 L14 17 L3 10 Z" fill="#fedf00" />
        <circle cx="14" cy="10" r="4" fill="#002776" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 28 20" className={className} aria-hidden role="img">
      <rect width="28" height="20" rx="2" fill="#fff" />
      {Array.from({ length: 7 }).map((_, i) => (
        <rect
          key={i}
          y={(i * 20) / 6.5}
          width="28"
          height={20 / 13}
          fill="#b22234"
        />
      ))}
      <rect width="12" height={(20 / 13) * 7} fill="#3c3b6e" />
    </svg>
  );
}

export default Flag;
