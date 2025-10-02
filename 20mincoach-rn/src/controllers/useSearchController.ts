import { useQuery } from '@tanstack/react-query';
import { fetchCoaches } from '@/src/services/coaches';
import { toCoach } from '@/src/mappers/coach.mapper';

export function useSearchController(q: string, category?: string) {
  const query = useQuery({
    queryKey: ['coaches', q, category],
    queryFn: async () => {
      const res = await fetchCoaches({ q, category });
      return res.items.map(toCoach);
    },
  });
  return { ...query };
}
