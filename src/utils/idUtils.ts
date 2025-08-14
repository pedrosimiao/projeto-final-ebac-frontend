// src/utils/idUtils.ts

export const isTempId = (id: string | undefined): boolean => {
  return typeof id === "string" && id.startsWith("temp-");
};
