const cacheMap = new Map<string, string>();

const getEnvVarCachedOrDefault = (key: string, defaultValue: string): string => {
  if (!cacheMap.has(key)) {
    cacheMap.set(key, process.env[key] ?? defaultValue);
  }

  return cacheMap.get(key) as string;
};

export const getEnvVarCachedOrThrow = (key: string): string => {
  if (!process.env[key]) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  if (!cacheMap.has(key)) {
    cacheMap.set(key, process.env[key]);
  }

  return cacheMap.get(key) as string;
};

export const getEnvironment = (): string => {
  return getEnvVarCachedOrDefault("ENVIRONMENT", "dev");
};

export const getPort = (): number => {
  return parseInt(getEnvVarCachedOrDefault("PORT", "3000"));
};
