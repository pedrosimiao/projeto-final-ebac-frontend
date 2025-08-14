// src/components/FeedHeader/index.tsx

import { ReactNode } from "react";
import { FeedHeaderContainer } from "./styles";

interface FeedHeaderProps {
  children: ReactNode;
  noPadding?: boolean;
}

const FeedHeader = ({ children, noPadding }: FeedHeaderProps) => {
  return <FeedHeaderContainer $noPadding={noPadding}>{children}</FeedHeaderContainer>;
};

export default FeedHeader;
