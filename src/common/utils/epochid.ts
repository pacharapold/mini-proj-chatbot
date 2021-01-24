const hash: Record<string, number> = {};

export const getEpochId = (tableName: string): number => {
  const r: number =
    tableName in hash ? hash[tableName] + 1 : new Date().getTime();
  hash[tableName] = r;
  return r;
};
