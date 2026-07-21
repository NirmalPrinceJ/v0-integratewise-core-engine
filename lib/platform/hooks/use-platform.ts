'use client';

import { useEffect, useState, useCallback } from 'react';
import { PlatformClient } from '../api/client';
import type { PlatformConfig } from '../api/client';

export function usePlatformClient(config: PlatformConfig) {
  const [client, setClient] = useState<PlatformClient | null>(null);

  useEffect(() => {
    if (config.token && config.tenantId) {
      setClient(new PlatformClient(config));
    }
  }, [config.token, config.tenantId]);

  return client;
}

// === Workspace ===

export function useWorkspaceProjection(
  client: PlatformClient | null,
  department: string
) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!client || !department) return;

    setLoading(true);
    client
      .getWorkspaceProjection(department)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [client, department]);

  return { data, loading, error };
}

export function useWorkspaceEntities(
  client: PlatformClient | null,
  type?: string,
  limit?: number
) {
  const [entities, setEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!client) return;

    setLoading(true);
    client
      .getWorkspaceEntities(type, limit)
      .then(result => setEntities(result.entities || []))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [client, type, limit]);

  return { entities, loading, error };
}

// === Connectors ===

export function useConnectors(client: PlatformClient | null) {
  const [connectors, setConnectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!client) return;

    setLoading(true);
    client
      .listConnectors()
      .then(result => setConnectors(result.connectors || []))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [client]);

  return { connectors, loading, error };
}

export function useConnectorCatalog(
  client: PlatformClient | null,
  department?: string
) {
  const [catalog, setCatalog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!client) return;

    setLoading(true);
    client
      .getConnectorCatalog(department)
      .then(setCatalog)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [client, department]);

  return { catalog, loading, error };
}

// === Integrations ===

export function useIntegrations(client: PlatformClient | null) {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const authorize = useCallback(
    async (provider: string) => {
      if (!client) return;
      try {
        const result = await client.authorizeIntegration(provider);
        return result;
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    [client]
  );

  const disconnect = useCallback(
    async (provider: string) => {
      if (!client) return;
      try {
        await client.disconnectIntegration(provider);
        setIntegrations(prev => prev.filter(i => i.provider !== provider));
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    [client]
  );

  useEffect(() => {
    if (!client) return;

    setLoading(true);
    client
      .listIntegrations()
      .then(setIntegrations)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [client]);

  return { integrations, loading, error, authorize, disconnect };
}

// === Capabilities ===

export function useCapabilities(client: PlatformClient | null) {
  const [capabilities, setCapabilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (capability: string, params?: any) => {
      if (!client) return;
      try {
        return await client.resolveCapability(capability, params);
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    [client]
  );

  useEffect(() => {
    if (!client) return;

    setLoading(true);
    client
      .listCapabilities()
      .then(result => setCapabilities(result.capabilities || []))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [client]);

  return { capabilities, loading, error, execute };
}

// === Intelligence ===

export function useBrainstorm(client: PlatformClient | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const query = useCallback(
    async (question: string, context?: any) => {
      if (!client) return;
      setLoading(true);
      try {
        return await client.brainstorm(question, context);
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  return { query, loading, error };
}

// === Onboarding ===

export function useOnboarding(client: PlatformClient | null) {
  const [state, setState] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const initialize = useCallback(
    async (domain: string, industry: string, department: string, connectors: any[]) => {
      if (!client) return;
      try {
        return await client.initializeSpine(domain, industry, department, connectors);
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    [client]
  );

  const complete = useCallback(
    async (preferences?: any) => {
      if (!client) return;
      try {
        return await client.completeOnboarding(preferences);
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    [client]
  );

  const getProgress = useCallback(async () => {
    if (!client) return;
    try {
      return await client.getOnboardingProgress();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [client]);

  useEffect(() => {
    if (!client) return;

    setLoading(true);
    client
      .getOnboardingState()
      .then(result => setState(result.onboarding))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [client]);

  return { state, loading, error, initialize, complete, getProgress };
}
