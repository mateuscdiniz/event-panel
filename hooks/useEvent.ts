import { useQuery } from '@tanstack/react-query';
import { fetchEvent } from '@/lib/api';

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEvent(id),
    enabled: Boolean(id),
  });
}
