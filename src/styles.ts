import { createGlobalStyle } from "styled-components";
import { darken } from "polished";

const GlobalStyleSheet = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
    list-style: none;
  }

  html, body, #root, #root > div {
    min-width: 0;
    width: 100%;
  }

  body {
    background: ${({ theme }) => theme.colors.backgroundGradient};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
    min-height: 100vh;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }

  #post-input,
  #reply-input {
    scroll-margin-top: 3.25rem; /* compensa o header fixo */
  }

  *:not(input):not(textarea):not([contenteditable="true"]) {
    caret-color: transparent;
  }

  *:not(input):not(textarea):not(button):not(a):not(select):not([tabindex]):focus {
    outline: none;
  }

  .custom-mentions-input {
    width: calc(100% - 2rem);
    min-height: 2.5rem;
    max-height: 11rem;
    margin-left: 3.4rem;
    border: none;
    outline: none !important;
    box-shadow: none !important;
    font-size: 1rem;
    background: transparent;
    color: ${({ theme }) => theme.colors.text};
    resize: none;
    overflow-y: hidden;
    padding: 0.5rem 0 0.5rem 0.5rem;

    &::placeholder {
      color: ${({ theme }) => theme.colors.text};
      font-size: 17px;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      margin-left: 2.9rem;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.smallest}) {
      width: 100%;
      margin-left: 2.4rem;
      padding: 0.2rem 0 0.5rem 0.5rem;
    }
  }

  .custom-mentions-reply-input {
    width: calc(100% - 2rem);
    min-height: 2.5rem;
    max-height: 11rem;
    margin-left: 2.3rem;
    border: none;
    outline: none !important;
    box-shadow: none !important;
    font-size: 1rem;
    background: transparent;
    color: ${({ theme }) => theme.colors.text};
    resize: none;
    overflow-y: hidden;
    padding: 0.5rem 0 0.5rem 0.5rem;

    &::placeholder {
      color: ${({ theme }) => theme.colors.text};
      font-size: 17px;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      margin-left: 1.9rem;
      padding: 0.2rem 0 0.5rem 0.5rem;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.smallest}) {
      width: 100%;
      margin-left: 1.3rem;
      padding: 0 0 0.5rem 0.5rem;
    }
  }

  .custom-mentions-input,
  .custom-mentions-reply-input {
    caret-color: ${({ theme }) => theme.colors.text};
  }


  .custom-mentions-input.in-modal,
  .custom-mentions-reply-input.in-modal {
    color: black;
    caret-color: black;
  }

  .custom-mentions-input.in-modal::placeholder,
  .custom-mentions-reply-input.in-modal::placeholder {
    color: black;
  }

  .custom-mention-panel {
    max-width: 300px !important;
    width: auto !important;
    min-width: 180px !important;
    border: 1px solid ${({ theme }) => theme.colors.border} !important;
    box-sizing: border-box !important;
    background-color: ${darken(0.13, "#485460")} !important;
  }

  .p-mention-item {
    padding: 0.2rem !important;
    color: ${({ theme }) => theme.colors.text};
    border-bottom: 2px solid ${({ theme }) => theme.colors.border} !important;
  }

  .p-mention-item:hover {
    background-color: ${darken(0.09, "#485460")} !important;
  }
`;

export default GlobalStyleSheet;
