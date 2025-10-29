import { useState, useEffect } from 'react';
import { database, PoemModel } from '@database';
import PoemService from '@services/PoemService';
import { Q } from '@nozbe/watermelondb';

interface UsePoemsOptions {
  author?: string;
  theme?: string;
  searchQuery?: string;
}

export const usePoems = (options?: UsePoemsOptions) => {
  const [poems, setPoems] = useState<PoemModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadPoems();
  }, [options?.author, options?.theme, options?.searchQuery]);

  const loadPoems = async () => {
    try {
      setLoading(true);
      const result = await PoemService.getPoems(options);
      setPoems(result);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading poems:', err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    loadPoems();
  };

  return { poems, loading, error, refresh };
};
