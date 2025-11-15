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

/**
 * Exclude a specific property from all objects in array
 * @param arr - The array of objects to process
 * @param key - The key of the property to exclude
 * @returns A new array of objects with the specified property excluded
 */
export const excludePropertyFromObjects = <T extends object, K extends keyof T>(arr: T[], key: K): Omit<T, K>[] => {
  return arr.map((item) => {
    const itemRes: T = {} as T;
    Object.keys(item).forEach((itemKey) => {
      if (itemKey !== key) {
        (itemRes as T)[itemKey as keyof T] = item[itemKey as keyof T];
      }
    });
    return itemRes;
  });
};
