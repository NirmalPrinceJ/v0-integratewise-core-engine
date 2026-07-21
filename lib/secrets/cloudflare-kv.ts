/**
 * Cloudflare KV Secret Store Integration
 * Centralized environment and secret management
 */

export interface SecretConfig {
  name: string;
  description: string;
  category: 'auth' | 'database' | 'api' | 'integration' | 'payment' | 'ai';
  required: boolean;
  example?: string;
}

// All secrets required by Customer Zero
export const REQUIRED_SECRETS: Record<string, SecretConfig> = {
  // Authentication
  CLERK_SECRET_KEY: {
    name: 'Clerk Secret Key',
    description: 'Clerk authentication secret',
    category: 'auth',
    required: true,
  },
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: {
    name: 'Clerk Publishable Key',
    description: 'Clerk public key for frontend',
    category: 'auth',
    required: true,
  },

  // Database
  DATABASE_URL: {
    name: 'Database URL',
    description: 'Primary Postgres connection string',
    category: 'database',
    required: true,
  },
  SUPABASE_URL: {
    name: 'Supabase URL',
    description: 'Supabase instance URL',
    category: 'database',
    required: true,
  },
  SUPABASE_ANON_KEY: {
    name: 'Supabase Anonymous Key',
    description: 'Supabase public key',
    category: 'database',
    required: true,
  },

  // Redis Cache
  REDIS_URL: {
    name: 'Redis URL',
    description: 'Redis connection string',
    category: 'database',
    required: false,
  },

  // Coda Integration
  CODA_API_TOKEN: {
    name: 'Coda API Token',
    description: 'Coda workspace API token',
    category: 'integration',
    required: false,
  },
  CODA_WORKSPACE_ID: {
    name: 'Coda Workspace ID',
    description: 'Coda workspace identifier',
    category: 'integration',
    required: false,
  },

  // Salesforce
  SALESFORCE_CLIENT_ID: {
    name: 'Salesforce Client ID',
    description: 'Salesforce OAuth client ID',
    category: 'integration',
    required: false,
  },
  SALESFORCE_CLIENT_SECRET: {
    name: 'Salesforce Client Secret',
    description: 'Salesforce OAuth client secret',
    category: 'integration',
    required: false,
  },
  SALESFORCE_ORG_ID: {
    name: 'Salesforce Org ID',
    description: 'Salesforce organization ID',
    category: 'integration',
    required: false,
  },

  // Slack
  SLACK_BOT_TOKEN: {
    name: 'Slack Bot Token',
    description: 'Slack bot user token',
    category: 'integration',
    required: false,
  },
  SLACK_WEBHOOK_URL: {
    name: 'Slack Webhook URL',
    description: 'Slack incoming webhook URL',
    category: 'integration',
    required: false,
  },

  // GitHub
  GITHUB_TOKEN: {
    name: 'GitHub Personal Access Token',
    description: 'GitHub PAT for API access',
    category: 'integration',
    required: false,
  },

  // Stripe Payments
  STRIPE_SECRET_KEY: {
    name: 'Stripe Secret Key',
    description: 'Stripe API secret key',
    category: 'payment',
    required: false,
  },
  STRIPE_PUBLISHABLE_KEY: {
    name: 'Stripe Publishable Key',
    description: 'Stripe public key',
    category: 'payment',
    required: false,
  },

  // HubSpot
  HUBSPOT_API_KEY: {
    name: 'HubSpot API Key',
    description: 'HubSpot API token',
    category: 'integration',
    required: false,
  },

  // Pipedrive
  PIPEDRIVE_API_TOKEN: {
    name: 'Pipedrive API Token',
    description: 'Pipedrive API access token',
    category: 'integration',
    required: false,
  },

  // Google OAuth
  GOOGLE_CLIENT_ID: {
    name: 'Google Client ID',
    description: 'Google OAuth client ID',
    category: 'auth',
    required: false,
  },
  GOOGLE_CLIENT_SECRET: {
    name: 'Google Client Secret',
    description: 'Google OAuth client secret',
    category: 'auth',
    required: false,
  },

  // AI/LLM APIs
  OPENAI_API_KEY: {
    name: 'OpenAI API Key',
    description: 'OpenAI API key for GPT models',
    category: 'ai',
    required: false,
  },
  ANTHROPIC_API_KEY: {
    name: 'Anthropic API Key',
    description: 'Anthropic Claude API key',
    category: 'ai',
    required: false,
  },

  // Vercel AI Gateway
  AI_GATEWAY_API_KEY: {
    name: 'Vercel AI Gateway API Key',
    description: 'Vercel AI Gateway for model access',
    category: 'ai',
    required: false,
  },

  // fal.ai
  FAL_API_KEY: {
    name: 'fal.ai API Key',
    description: 'fal.ai API token for image generation',
    category: 'ai',
    required: false,
  },

  // Cloudflare
  CLOUDFLARE_ACCOUNT_ID: {
    name: 'Cloudflare Account ID',
    description: 'Cloudflare account ID',
    category: 'database',
    required: false,
  },
  CLOUDFLARE_API_TOKEN: {
    name: 'Cloudflare API Token',
    description: 'Cloudflare API token for KV/D1/R2',
    category: 'database',
    required: false,
  },

  // Sentry
  SENTRY_DSN: {
    name: 'Sentry DSN',
    description: 'Sentry error tracking DSN',
    category: 'integration',
    required: false,
  },

  // PostHog Analytics
  POSTHOG_API_KEY: {
    name: 'PostHog API Key',
    description: 'PostHog analytics API key',
    category: 'integration',
    required: false,
  },
};

/**
 * Get all required secrets
 */
export function getRequiredSecrets(): SecretConfig[] {
  return Object.values(REQUIRED_SECRETS).filter(s => s.required);
}

/**
 * Get all optional secrets
 */
export function getOptionalSecrets(): SecretConfig[] {
  return Object.values(REQUIRED_SECRETS).filter(s => !s.required);
}

/**
 * Validate secret is set
 */
export function validateSecret(name: string): boolean {
  const value = process.env[name];
  return !!value && value.length > 0;
}

/**
 * Validate all required secrets
 */
export function validateRequiredSecrets(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  for (const secret of getRequiredSecrets()) {
    const config = REQUIRED_SECRETS[secret.name];
    if (!validateSecret(config.name)) {
      missing.push(config.name);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Get secret value safely
 */
export function getSecret(name: string): string | undefined {
  const config = REQUIRED_SECRETS[name];
  if (!config) {
    console.warn(`[v0] Unknown secret requested: ${name}`);
    return undefined;
  }

  const value = process.env[name];
  if (!value && config.required) {
    throw new Error(`[v0] Required secret missing: ${name}`);
  }

  return value;
}

/**
 * Get all secrets by category
 */
export function getSecretsByCategory(category: SecretConfig['category']): SecretConfig[] {
  return Object.values(REQUIRED_SECRETS).filter(s => s.category === category);
}
