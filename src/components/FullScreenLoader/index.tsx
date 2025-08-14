// src/components/FullScreenLoader/index.tsx

import styled from "styled-components";
import LoadingSpinner from "../Loading";

const FullScreenLoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
`;

interface FullScreenLoaderProps {
  size?: string;
  $spinnerColor?: "text" | "accent" | "background";
}

const FullScreenLoader = ({ size = "3rem", $spinnerColor = "text" }: FullScreenLoaderProps) => {
  return (
    <FullScreenLoaderContainer>
      <LoadingSpinner $spinnerColor={$spinnerColor} size={size} />
    </FullScreenLoaderContainer>
  );
};

export default FullScreenLoader;
