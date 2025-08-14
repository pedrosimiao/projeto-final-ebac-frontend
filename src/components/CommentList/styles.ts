import styled from "styled-components";

export const CommentListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  /* padding horizontal se necessário, mas CUIDADO para não duplicar com CommentCard */
  /* padding: 0 1rem; */
`;

export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  background: ${({ theme }) => theme.colors.backgroundGradient};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background};
`;

export const ShowMoreLessButton = styled.button`
    font-size: 1rem;
    color: #fff;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;

    &:hover {
        text-decoration: underline;
    }
`;
