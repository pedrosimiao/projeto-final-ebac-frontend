import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10001;
`;

export const ModalContent = styled.div`
  background-color: #fff;
  padding: 2rem;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    max-width: 80%;
  }
`;

export const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.textAlt};
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button<{ selected?: boolean }>`
  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.background : theme.colors.text};
  color: ${({ theme, selected }) =>
    selected ? theme.colors.text : theme.colors.backgroundGradient};
  border: 2px solid ${({ theme }) => theme.colors.background};
  font-size: 0.9rem;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 16px;
  cursor: pointer;
  flex: 1;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const ConfirmDelete = styled(ActionButton)``;

export const CancelButton = styled(ActionButton)``;
