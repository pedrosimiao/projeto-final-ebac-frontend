// src/components/FeedContent/index.tsx

import { RefObject, useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";

import { FeedContainer } from "./styles";
import { FeedLayoutContext } from "../../app/FeedLayoutContext";

interface FeedContentProps {
  pageScrollRef: RefObject<HTMLDivElement | null>;
}

const FeedContent = ({ pageScrollRef }: FeedContentProps) => {
  const feedContainerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ left: 0, width: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      if (feedContainerRef.current) {
        const rect = feedContainerRef.current.getBoundingClientRect();
        setDimensions({ left: rect.left, width: rect.width })
      }
    };

    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <FeedLayoutContext.Provider value={{ feedContainerDimensions: dimensions }}>
      <FeedContainer ref={feedContainerRef}>
        <Outlet context={{ pageScrollRef }} />
      </FeedContainer>
    </FeedLayoutContext.Provider>
  );
};

export default FeedContent;
