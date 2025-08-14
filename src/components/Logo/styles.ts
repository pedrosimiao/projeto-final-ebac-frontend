// src/components/Logo/styles.ts
import styled from "styled-components";

// Define as propriedades opcionais para largura e altura
export interface LogoProps {
  width?: string;
  height?: string;
}

// O componente LogoImage agora utiliza as props para definir os tamanhos
const LogoImage = styled.img<LogoProps>`
  width: ${({ width }) => width || "240px"};
  height: ${({ height }) => height || "auto"};

  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5));

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    width: ${({ width }) => (width ? `calc(${width} * 0.65)` : "150px")};
  }
`;

export default LogoImage;
