// src/utils/apiErrorUtils.ts

import axios from "axios";

export interface ApiError {
  detail?: string;
  [key: string]: string | string[] | undefined;
}

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError | undefined;

    if (data?.detail) {
      return data.detail; // priorizando erros genéricos (credenciais inválidas)
    }

    if (data) {
      const fieldErrors: string[] = [];
      // iteração sobre cada key/field do objeto de dados do erro
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const messages = data[key];

          if (Array.isArray(messages)) {
            // junta as mensagens e add ao array de erros
            fieldErrors.push(`${key}: ${messages.join(", ")}`);

          } else if (typeof messages === "string") {
            // for uma string simples
            fieldErrors.push(`${key}: ${messages}`);
          }
        }
      }
      if (fieldErrors.length > 0) {
        // todas as mensagens de erro de campo em uma única string
        return fieldErrors.join("; ");
      }
    }

    // fallback (mensagem do Axios ou "Unknown error")
    return error.message;
  }

  return "Unknown error";
}
