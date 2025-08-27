// src/components/FeedHeader/index.tsx

import { ReactNode, useContext } from "react";
import { FeedHeaderContainer } from "./styles";
import { FeedLayoutContext } from "../../app/FeedLayoutContext";

interface FeedHeaderProps {
  children: ReactNode;
  noPadding?: boolean;
}

const FeedHeader = ({ children, noPadding }: FeedHeaderProps) => {
  const { feedContainerDimensions } = useContext(FeedLayoutContext);

  return (
    <FeedHeaderContainer
      $noPadding={noPadding}
      $fixedLeft={feedContainerDimensions.left}
      $fixedWidth={feedContainerDimensions.width}
    >
      {children}
    </FeedHeaderContainer>
  );
};

export default FeedHeader;
