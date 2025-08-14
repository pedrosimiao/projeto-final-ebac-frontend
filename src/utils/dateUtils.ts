// src/utils/dateUtils.ts

// Importa funções da biblioteca date-fns para manipulação e formatação de datas.
import { format, formatDistanceToNowStrict, parseISO } from "date-fns";
// locale enUS para formatação de datas em inglês dos EUA.
import { enUS } from "date-fns/locale";

/**
 * Formata uma string de data ISO para o formato desejado.
 * @param dateStr - A data no formato ISO (ex: "1990-01-01" ou "1990-01-01T00:00:00Z").
 * @param dateFormat - O formato desejado (ex: "MMMM d, yyyy" para "January 1, 1990").
 * @returns A data formatada como string.
 */

export const formatDate = (dateStr: string, dateFormat: string): string => {
  // Converte a string ISO para um objeto Date do JavaScript.
  const parsedDate = parseISO(dateStr);
  // Formata o objeto Date 'parsedDate' para uma string no formato especificado por 'dateFormat'.
  return format(parsedDate, dateFormat);
};

/**
 * Retorna uma representação concisa de quanto tempo atrás uma determinada data ocorreu
 * (ex: "5m" para 5 minutos atrás, "2h" para 2 horas atrás, "1d" para 1 dia atrás).
 * @param dateStr - A data no formato ISO.
 * @returns Uma string representando o tempo decorrido desde a data fornecida.
 */
export const getTimeAgo = (dateStr: string): string => {
  // Converte a string ISO para um objeto Date.
  const parsedDate = parseISO(dateStr);
  // Calcula a distância entre a data fornecida e a data atual.
  const formatted = formatDistanceToNowStrict(parsedDate, {
    addSuffix: false,
    locale: enUS,
  });

  // Substituições de string para tornar a representação do tempo mais curta.
  return formatted
    .replace(/ minutes?/, "m")
    .replace(/ hours?/, "h")
    .replace(/ days?/, "d")
    .replace(/ weeks?/, "w")
    .replace(/ months?/, "mo")
    .replace(/ years?/, "y");
};
