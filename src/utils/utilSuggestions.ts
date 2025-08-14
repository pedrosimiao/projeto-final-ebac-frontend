// src/utils/utilSuggestions.ts

import { IPost, IUser } from "../types"; // Importa as interfaces IPost e IUser definidas em "../types.ts", representando a estrutura de um post e de um usuário, respectivamente.

/**
 * Filtra uma lista de usuários com base em uma string de consulta.
 * A filtragem é feita comparando a consulta (em minúsculas) com o username,
 * firstName e lastName de cada usuário (também convertidos para minúsculas).
 *
 * @param users Um array de objetos IUser a serem filtrados.
 * @param query A string de consulta a ser usada para filtrar os usuários.
 * @returns Um novo array de IUser contendo apenas os usuários que correspondem à consulta.
 */

// Converte a string de consulta para case-insensitive,
// verifica se os nomes de usuário contém a string de consulta
export const filterUsers = (users: IUser[], query: string): IUser[] => {
  const lowerQuery = query.toLowerCase();
  return users.filter(
    user =>
      user.username.toLowerCase().includes(lowerQuery) ||
      user.firstName.toLowerCase().includes(lowerQuery) ||
      user.lastName.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Extrai as tendências (hashtags) de uma lista de posts.
 * Procura por palavras que começam com "#" usando expressões regulares.
 *
 * @param posts Um array de objetos IPost dos quais as tendências serão extraídas.
 * @returns Um array de strings, onde cada string é uma tendência (hashtag sem o "#").
 */

export const extractTrendsFromPosts = (posts: IPost[]): string[] => {
  // trendSet =  Set para armazenar as tendências encontradas ignorando duplicidades.
  const trendSet = new Set<string>();

  // '#' corresponde ao caractere '#'.
  // '([\w]+)' captura um ou mais caracteres alfanuméricos (letras, números e underscore) após o '#'.
  // 'g' flag para realizar uma busca global (encontrar todas as ocorrências na string).
  const hashtagRegex = /#([\w]+)/g;

  // Itera sobre cada 'post' no array 'posts'.
  posts.forEach(post => {
    // Variável 'match' para armazenar os resultados da busca da regex.
    let match;

    // Enquanto a regex encontrar correspondências na string 'post.content'.
    // 'hashtagRegex.exec(post.content)' tenta encontrar a próxima correspondência da regex em 'post.content'.
    while ((match = hashtagRegex.exec(post.content)) !== null) {
      trendSet.add(match[1]); // 'match[1]' contém o texto capturado pelo primeiro grupo na regex (os caracteres depois de '#').
    }
    // Quando 'while' termina, a iteração forEach continua para o próximo post.
  });
  return Array.from(trendSet); // Converte o 'trendSet' em um novo Array (lista simples sem duplicidade).
};
