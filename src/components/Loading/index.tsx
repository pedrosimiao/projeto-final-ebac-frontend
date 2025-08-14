// src/components/Loading/index.tsx

import { SpinnerContainer, SpinnerIcon } from "./styles";

interface LoadingSpinnerProps {
  $spinnerColor?: 'text' | 'background' | 'accent';
  size?: string;
}

const LoadingSpinner = ({ $spinnerColor, size }: LoadingSpinnerProps) => {
  return (
    <SpinnerContainer $spinnerColor={$spinnerColor}>
      <SpinnerIcon $size={size} />
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
