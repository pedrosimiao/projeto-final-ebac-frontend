// src/components/FeedContent/index.tsx

import { RefObject } from "react";
import { Outlet } from "react-router-dom";

import { FeedContainer } from "./styles";

interface FeedContentProps {
  pageScrollRef: RefObject<HTMLDivElement | null>;
}

const FeedContent = ({ pageScrollRef }: FeedContentProps) => {
  return (
    <FeedContainer>
      <Outlet context={{ pageScrollRef }} />
    </FeedContainer>
  );
};

export default FeedContent;
