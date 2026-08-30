import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();
const PROJECT_ID = process.env.GCP_PROJECT_ID || 'project-a9c284f8-6bca-440a-a0c';

// Cache secrets in memory to avoid repeated API calls
const secretCache = new Map<string, { value: string; expiry: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function getSecret(secretName: string): Promise<string> {
  const cached = secretCache.get(secretName);
  if (cached && Date.now() < cached.expiry) {
    return cached.value;
  }

  if (process.env.NODE_ENV === 'development') {
    const envMap: Record<string, string> = {
      'gemini-api-key': 'GEMINI_API_KEY',
    };
    const envVar = envMap[secretName];
    if (envVar && process.env[envVar]) {
      return process.env[envVar]!;
    }
  }

  try {
    const name = `projects/${PROJECT_ID}/secrets/${secretName}/versions/latest`;
    const [version] = await client.accessSecretVersion({ name });
    const payload = version.payload?.data;
    if (!payload) throw new Error(`Secret ${secretName} has no payload`);
    const value = typeof payload === 'string' ? payload : Buffer.from(payload).toString('utf8');
    secretCache.set(secretName, { value, expiry: Date.now() + CACHE_TTL_MS });
    return value;
  } catch (error) {
    const envMap: Record<string, string> = { 'gemini-api-key': 'GEMINI_API_KEY' };
    const envVar = envMap[secretName];
    if (envVar && process.env[envVar]) {
      console.warn(`Secret Manager failed for ${secretName}, using env var fallback`);
      return process.env[envVar]!;
    }
    throw error;
  }
}

export async function getGeminiApiKey(): Promise<string> {
  return getSecret('gemini-api-key');
}
