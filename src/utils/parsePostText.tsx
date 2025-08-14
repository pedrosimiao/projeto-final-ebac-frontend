//src/utils/parsePostText.ts

import { ReactNode } from "react";

import twemoji from "twemoji"; // Importa a biblioteca twemoji para converter emojis Unicode em imagens.

import { StyledHashtag, StyledLink, StyledMention } from "./StyledTokens";

/**
 * Helper para converter emojis Unicode em elementos <img> do Twemoji.
 *
 * @param text A string de texto a ser analisada em busca de emojis.
 * @returns Um array de ReactNode, onde os emojis são substituídos por elementos <img>.
 */

const parseEmojis = (text: string): ReactNode[] => {
  // Regex para encontrar todos os caracteres Unicode que são emojis.
  // 'gu' flags: 'g' para correspondência global (encontrar todas as ocorrências) e 'u' para suportar caracteres Unicode.
  const regex = /\p{Emoji}/gu;

  // Array para armazenar as partes do texto (texto normal e elementos <img> para emojis).
  const parts: ReactNode[] = [];

  // Mantém o índice da última parte do texto processada.
  let lastIndex = 0;

  // Encontra todas as ocorrências de emojis na string 'text' e retorna um array de objetos de correspondência.
  const matches = [...text.matchAll(regex)];
  // Itera sobre cada correspondência de emoji encontrada.
  matches.forEach((match, index) => {
    const emoji = match[0]; // O emoji encontrado na correspondência.
    const emojiIndex = match.index || 0; // O índice onde o emoji foi encontrado na string.

    // Se houver texto entre o último emoji processado e o emoji atual, adiciona esse texto ao array 'parts'.
    if (lastIndex < emojiIndex) {
      parts.push(text.slice(lastIndex, emojiIndex));
    }

    // Converte o emoji Unicode para seu código de ponto no formato usado pelo Twemoji.
    const codePoint = twemoji.convert.toCodePoint(emoji);
    // Constrói a URL da imagem do emoji no CDN do Twemoji.
    const url = `https://twemoji.maxcdn.com/v/latest/72x72/${codePoint}.png`;
    // Adiciona um elemento <img> ao array 'parts' para exibir o emoji como uma imagem.
    parts.push(
      <img
        key={`emoji-${index}`} // Chave única para o elemento React.
        src={url} // URL da imagem do emoji.
        alt={emoji} // Texto alternativo para a imagem (o próprio emoji).
        style={{ width: "1em", height: "1em", verticalAlign: "middle" }} // Estilos inline básicos para alinhar o emoji com o texto.
      />
    );

    // Atualiza o índice da última parte do texto processada para após o emoji atual.
    lastIndex = emojiIndex + emoji.length;
  });

  // Adiciona qualquer texto restante após o último emoji encontrado ao array 'parts'.
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  // Retorna o array de ReactNode contendo o texto original com os emojis substituídos por imagens.
  return parts;
};

/**
 * Analisa o texto de um post para identificar URLs, menções (@usuário), hashtags (#hashtag) e quebras de linha (\n),
 * renderizando-os com estilos específicos ou convertendo emojis.
 *
 * @param text A string de texto do post a ser analisada.
 * @returns Um array de ReactNode, onde URLs são links, menções são links para perfis,
 * hashtags são elementos estilizados e emojis são imagens.
 */
export function parsePostText(text: string): ReactNode[] {
  // Regex para encontrar URLs (http(s)://seguido por qualquer caractere não espaço),
  // menções (@ seguido por letras, números e underscores),
  // hashtags (# seguido por letras, números e underscores) e quebras de linha (\n).
  // O 'g' flag garante que todas as ocorrências sejam encontradas.
  const regex = /(https?:\/\/[^\s]+|@[\w_]+|#[\w_]+|\n)/g;

  // Divide o texto em um array de tokens usando o regex como separador.
  // As partes correspondentes ao regex também são incluídas no array resultante.
  const tokens = text.split(regex);

  // Mapeia cada token para um elemento ReactNode.
  // 'flatMap' é usado para lidar com o resultado de 'parseEmojis' que pode ser um array.
  return tokens.flatMap((token, index) => {
    // Se o token for uma quebra de linha, retorna um elemento <br>.
    if (token === "\n") return <br key={`br-${index}`} />;

    // Se o token começar com 'http://' ou 'https://', é um URL.
    if (/^https?:\/\//.test(token)) {
      // Retorna um componente StyledLink com o URL como href, abrindo em uma nova aba por segurança.
      return (
        <StyledLink key={`url-${index}`} href={token} target="_blank" rel="noopener noreferrer">
          {token}
        </StyledLink>
      );
    }

    // Se o token começar com '@' seguido por caracteres alfanuméricos e underscore, é uma menção.
    if (/^@\w+/.test(token)) {
      // Extrai o nome de usuário removendo o '@'.
      const username = token.slice(1);
      // Retorna um componente StyledMention que provavelmente é um link para o perfil do usuário.
      return (
        <StyledMention key={`mention-${index}`} to={`/${username}`}>
          {token}
        </StyledMention>
      );
    }

    // Se o token começar com '#' seguido por caracteres alfanuméricos e underscore, é uma hashtag.
    if (/^#\w+/.test(token)) {
      // Retorna um componente StyledHashtag com um estilo inline para cor e negrito.
      // O 'to={"#"}' sugere que pode ser um link para uma página de hashtags (a funcionalidade real dependerá da implementação de StyledHashtag).
      return (
        <StyledHashtag
          key={`hashtag-${index}`}
          to={"#"}
          style={{ color: "#1DA1F2", fontWeight: "bold" }}
        >
          {token}
        </StyledHashtag>
      );
    }

    // Se o token não corresponder a nenhuma das condições acima (quebra de linha, URL, menção, hashtag),
    // assume-se que seja texto normal (possivelmente contendo emojis) e é passado para a função 'parseEmojis'.
    return parseEmojis(token);
  });
}
