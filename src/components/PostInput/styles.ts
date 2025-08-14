// src/components/PostInput/styles.ts

import styled from "styled-components";

interface CommentProps {
  $isComment?: boolean;
  $isInModal?: boolean;
}

export const PostInputContainer = styled.div<CommentProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 7.25rem;
  padding: 1rem;
  border-bottom: ${({ theme, $isInModal }) => ($isInModal ? "none" : `2px solid ${theme.colors.border}`)};
  position: relative;

  ${({ $isComment }) =>
    $isComment &&
    `
    border-bottom: none;
  `}
`;

export const UserAvatar = styled.img<CommentProps>`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  position: absolute;
  top: 0.5rem;
  left: 1rem;
  margin-top: 0.3rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    top: 0.3rem;
    left: 0.8rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.smallest}) {
    top: 0.2rem;
    left: 0.5rem;
    width: 2.8rem;
    height: 2.8rem;
  }

  ${({ $isComment, theme }) =>
    $isComment &&
    `
    width: 2.5rem;
    height: 2.5rem;
    top: 0.7rem;
    left: 0.7rem;

    @media (max-width: ${theme.breakpoints.mobile}) {
      width: 2.5rem;
      height: 2.5rem;
      left: 0.5rem;
    }

    @media (max-width: ${theme.breakpoints.smallest}) {
      width: 2rem;
      height: 2rem;
      left: 0.2rem;
    }
  `}
`;

export const RepliedToLabel = styled.span`
  font-size: 0.85rem;
  font-weight: bold;
  color: #ecf0f1;
  margin-left: 2.8rem;
  display: flex;
  align-items: center;

  svg {
    margin-left: 0.5rem;
    cursor: pointer;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 0.75rem;
    margin-left: 2.3rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.smallest}) {
    margin-left: 1.8rem;
  }
`;

export const MediaActions = styled.div<CommentProps>`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  margin-left: 4rem;
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-left: 3.5rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.smallest}) {
    margin-left: 3rem;
  }

  ${({ $isComment, theme }) =>
    $isComment &&
    `
    margin-top: 1rem;
    margin-left: 2.8rem;

    @media (max-width: ${theme.breakpoints.mobile}) {
      margin-left: 2.3rem;
    }

    @media (max-width: ${theme.breakpoints.smallest}) {
      margin-left: 1.7rem;
    }
  `}
`;

export const ActionButton = styled.button<CommentProps>`
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: ${({ theme, $isInModal }) => ($isInModal ? theme.colors.background : theme.colors.text)};
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

export const PostButton = styled.button<CommentProps>`
  background-color: ${({ theme, $isInModal }) => ($isInModal ? theme.colors.background : theme.colors.text)};
  color: ${({ theme, $isInModal }) => ($isInModal ? theme.colors.text : theme.colors.background)};
  border: 2px solid ${({ theme }) => theme.colors.background};
  font-size: 0.9rem;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 16px;
  cursor: pointer;
  position: absolute;
  bottom: 1rem;
  right: 1.5rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const MediaPreview = styled.div<CommentProps>`
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;

  img,
  video {
    max-width: 100%;
    max-height: 50vh;
    border-radius: 8px;

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      max-width: 400px;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.smallest}) {
      max-width: 300px;
    }

    ${({ $isComment, theme }) =>
      $isComment &&
      `
      @media (max-width: ${theme.breakpoints.mobile}) {
        max-width: 300px;
      }

      @media (max-width: ${theme.breakpoints.smallest}) {
        max-width: 260px;
      }
    `}

    ${({ $isComment, $isInModal, theme }) =>
      $isComment &&
      $isInModal &&
      `
      @media (max-width: ${theme.breakpoints.mobile}) {
        max-width: 300px;
      }

      @media (max-width: ${theme.breakpoints.smallest}) {
        max-width: 240px;
      }
    `}

    ${({ $isComment, $isInModal, theme }) =>
      !$isComment &&
      $isInModal &&
      `
      @media (max-width: ${theme.breakpoints.mobile}) {
        max-width: 320px;
      }

      @media (max-width: ${theme.breakpoints.smallest}) {
        max-width: 240px;
      }
    `}
  }
`;

export const MediaActionButton = styled.button<CommentProps>`
  position: absolute;
  top: 1rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const CloseButton = styled(MediaActionButton)`
  right: 0.5rem;
`;



export const EmojiWrapper = styled.div`
  /* display: inline-block; */
  position: relative;
  display: flex;
  align-items: center;
`;


export const EmojiPickerContainer = styled.div`
  z-index: 10000;
  border: 1px solid #222222;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transform: scale(0.6) translateX(-79%);
  transform-origin: top;
  position: absolute;

  top: 100%;
  margin-top: 8px;

  &::after {
    content: "";
    left: 50%;
    transform: translateX(-50%);
    border: 12px solid transparent;
    bottom: 100%;
    border-bottom-color: #222222;
    position: absolute;
  }
`;



export const TrendItem = styled.div`
  padding: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.accent};
`;

export const SuggestionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.5rem;
`;

export const SuggestionImage = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
`;

export const SuggestionText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  span {
    font-size: 0.9rem;
  }
  small {
    font-size: 0.75rem;
    color: gray;
  }
`;



export const RetweetPreviewContainer = styled.div`
  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  padding: 0.8rem;
  margin-top: 0.5rem;
  margin-left: 3rem;
  margin-right: 1rem;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const RetweetHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;

export const RetweetAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

export const RetweetUserInfo = styled.div`
  display: flex;
  flex-direction: column;
  h4 {
    margin: 0;
    font-size: 0.95rem;
  }
  p {
    margin: 0;
    font-size: 0.8rem;
    color: gray;
  }
`;

export const RetweetContent = styled.div`
  font-size: 0.9rem;
  line-height: 1.3;
`;

export const RetweetMedia = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;

  img,
  video {
    max-width: 100%;
    max-height: 700px;

    border-radius: 8px;

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      max-width: 280px;
      max-height: 480px;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.smallest}) {
      max-width: 200px;
      max-height: 400px;
    }
  }
`;

export const RetweetFooter = styled.div`
  padding: 0 3rem;
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.9rem;

  div {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0 1rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.smallest}) {
    padding: 0 0.5rem;
  }
`;

export const CancelRetweetButton = styled.button`
  position: absolute;
  align-self: flex-end;
  margin-top: 0.5rem;
  margin-right: 0.5rem;
  font-size: 1rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
