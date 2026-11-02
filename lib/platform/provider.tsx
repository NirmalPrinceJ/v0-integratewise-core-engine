'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { PlatformClient, PlatformConfig } from './api/client';
import { useAuth } from '@clerk/nextjs';

interface PlatformContextType {
  client: PlatformClient | null;
  isReady: boolean;
  config: PlatformConfig | null;
}

const PlatformContext = createContext<PlatformContextType>({
  client: null,
  isReady: false,
  config: null,
});

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within PlatformProvider');
  }
  return context;
}

interface PlatformProviderProps {
  children: React.ReactNode;
  gatewayUrl?: string;
}

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

function PlatformSession({
  children,
  gatewayUrl,
}: Required<Pick<PlatformProviderProps, 'children'>> & Pick<PlatformProviderProps, 'gatewayUrl'>) {
  const { user } = useAuth();
  const [client, setClient] = useState<PlatformClient | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // In a real app, you'd fetch these from your backend
    // For now, they should come from environment variables
    const token = process.env.NEXT_PUBLIC_INTEGRATEWISE_API_TOKEN;
    const tenantId = process.env.NEXT_PUBLIC_INTEGRATEWISE_TENANT_ID;

    if (token && tenantId && user) {
      const config: PlatformConfig = {
        baseUrl: gatewayUrl,
        token,
        tenantId,
        userId: user.id,
        userRole: 'owner',
      };

      setClient(new PlatformClient(config));
      setIsReady(true);
    }
  }, [user, gatewayUrl]);

  return (
    <PlatformContext.Provider
      value={{
        client,
        isReady,
        config: {
          token: process.env.NEXT_PUBLIC_INTEGRATEWISE_API_TOKEN || '',
          tenantId: process.env.NEXT_PUBLIC_INTEGRATEWISE_TENANT_ID || '',
        },
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

export function PlatformProvider({
  children,
  gatewayUrl = 'https://gateway.dev.integratewise.ai/api/v1',
}: PlatformProviderProps) {
  if (!clerkEnabled) {
    return (
      <PlatformContext.Provider value={{ client: null, isReady: false, config: null }}>
        {children}
      </PlatformContext.Provider>
    )
  }

  return <PlatformSession gatewayUrl={gatewayUrl}>{children}</PlatformSession>
}
