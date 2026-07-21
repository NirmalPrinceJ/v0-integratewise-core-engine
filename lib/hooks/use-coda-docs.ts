'use client';

import { useEffect, useState, useCallback } from 'react';

export interface CodaDocCategory {
  category: string;
  docName: string;
  docId: string;
  sections: number;
  tables: number;
  lastSync: string;
}

export interface CodaDocData {
  id: string;
  name: string;
  published: boolean;
  updatedAt: string;
}

export interface UseCodaDocsReturn {
  docs: CodaDocData[];
  categories: CodaDocCategory[];
  loading: boolean;
  error: string | null;
  syncDocs: () => Promise<void>;
  fetchByCategory: (category: string) => Promise<any>;
}

/**
 * Hook to fetch and sync IntegrateWise strategic documentation from Coda
 */
export function useCodeDocs(): UseCodaDocsReturn {
  const [docs, setDocs] = useState<CodaDocData[]>([]);
  const [categories, setCategories] = useState<CodaDocCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch available docs
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/integrations/coda/sync');
        if (!response.ok) {
          throw new Error(`Failed to fetch docs: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.success) {
          setDocs(data.docs || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load docs');
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  // Sync docs to Spine
  const syncDocs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/integrations/coda/sync', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to sync docs');
      }

      const data = await response.json();
      if (data.success && data.data?.categories) {
        setCategories(data.data.categories);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch specific doc by category
  const fetchByCategory = useCallback(async (category: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/integrations/coda/sync?category=${encodeURIComponent(category)}`
      );

      if (!response.ok) {
        throw new Error(`Doc not found: ${category}`);
      }

      const data = await response.json();
      return data.doc;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    docs,
    categories,
    loading,
    error,
    syncDocs,
    fetchByCategory,
  };
}
