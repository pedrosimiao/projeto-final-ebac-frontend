// src/theme.ts

import { darken, rgba } from "polished";

export const theme = {
  colors: {
    background: "#be2edd",
    backgroundGradient: `linear-gradient(135deg, #be2edd, ${darken(0.3, "#be2edd")})`,
    textGradient: `linear-gradient(100deg, #ffffff, ${darken(0.1, "#ffffff")})`,
    text: "#ffffff",
    textAlt: "#333333",
    accent: "#ecf0f1",
    border: rgba(255, 255, 255, 0.7),
    link: "#0088ff",
  },
  breakpoints: {
    smallest: "375px",
    mobile: "425px",
    tablet: "768px",
    desktop: "1024px",
  },
};
